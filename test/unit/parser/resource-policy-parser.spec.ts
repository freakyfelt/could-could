import jsonLogic from "json-logic-js";
import { ResourcePolicyParser } from "../../../lib/parser";
import {
  BasicResourcePolicy,
  BasicContextualResourcePolicy,
  MultipleActionsPolicy,
  InContextResourcePolicy,
  BasicDenyPolicy,
} from "../../fixtures/policies/valid";

describe("ResourcePolicyParser", () => {
  const parser = new ResourcePolicyParser();

  describe("with a basic allow policy", () => {
    const policies = parser.parse(BasicResourcePolicy);

    it("returns true for the create action", () => {
      const logic = policies.get("create")!;

      expect(jsonLogic.apply(logic)).toEqual(true);
    });

    it("returns false for another defined action", () => {
      const logic = policies.get("read")!;

      expect(jsonLogic.apply(logic)).toEqual(false);
    });
  });

  describe("with a multiple action policy", () => {
    const policies = parser.parse(MultipleActionsPolicy);
    const allowed = ["create", "read"];

    it("returns true for both actions", () => {
      allowed.forEach((action) => {
        const logic = policies.get(action)!;

        expect(jsonLogic.apply(logic)).toEqual(true);
      });
    });

    it("returns false for any other action", () => {
      MultipleActionsPolicy.actions
        .filter((action) => !allowed.includes(action))
        .forEach((action) => {
          const logic = policies.get(action)!;

          expect(jsonLogic.apply(logic)).toEqual(false);
        });
    });
  });

  describe("with a simple deny action on a stage", () => {
    const policies = parser.parse(BasicDenyPolicy);

    it("takes precedence over any allow", () => {
      const logic = policies.get("create")!;

      expect(jsonLogic.apply(logic)).toEqual(false);
    });
  });

  describe("with a basic contextual resource policy", () => {
    const policies = parser.parse(BasicContextualResourcePolicy);

    it("rejects a subject that matches the deny criteria", () => {
      const data = {
        subject: { id: "me" },
        doc: { createdBy: "me" },
      };

      const logic = policies.get("create")!;
      expect(jsonLogic.apply(logic, data)).toEqual(false);
    });

    it("allows a subject that does not match the dney criteria", () => {
      const data = {
        subject: { id: "somebody" },
        doc: { createdBy: "me" },
      };

      const logic = policies.get("create")!;
      expect(jsonLogic.apply(logic, data)).toEqual(true);
    });
  });

  describe("with a contextual resource policy containing an in constraint", () => {
    const policies = parser.parse(InContextResourcePolicy);

    it("rejects a subject that matches the deny criteria", () => {
      const data = { subject: { groups: ["group5"] } };

      const logic = policies.get("create")!;
      expect(jsonLogic.apply(logic, data)).toEqual(false);
    });

    it("allows a subject that does not match the dney criteria", () => {
      const data = { subject: { groups: ["group3"] } };

      const logic = policies.get("create")!;
      expect(jsonLogic.apply(logic, data)).toEqual(true);
    });
  });
});
