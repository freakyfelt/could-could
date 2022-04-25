import { createPolicyStore } from "../../lib/parser";
import { PolicyResolver } from "../../lib/resolver";
import { BasicContextualResourcePolicy } from "../fixtures/policies/valid";

const resourceType = BasicContextualResourcePolicy.resourceType;
const action = "create";

const exampleDocument = {
  id: "mydoc",
  createdBy: "testy.mctesterson",
};

const creator = {
  id: "testy.mctesterson",
  groups: ["group1"],
} as const;

const otherSubject = {
  id: "samba.d.else",
  groups: ["group1"],
};

describe("PolicyResolver", () => {
  const policyStore = createPolicyStore({
    policies: [BasicContextualResourcePolicy],
    targetEnvironment: "production",
  });
  const resolver = new PolicyResolver(policyStore);

  it("finds and evaluates the policy with a given context", () => {
    const result = resolver.can(
      { action, resourceType },
      { doc: exampleDocument, subject: creator }
    );

    expect(result).toEqual(false);
  });

  it("returns false if the call is made without required context", () => {
    const result = resolver.can({ action, resourceType });

    expect(result).toEqual(false);
  });

  it("throws with an unknown resource type", () => {
    expect(() =>
      resolver.can({ action, resourceType: "SomethingElse" })
    ).toThrow();
  });

  it("throws with an unknown action", () => {
    expect(() => resolver.can({ action: "unknown", resourceType })).toThrow();
  });
});
