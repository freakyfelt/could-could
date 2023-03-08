import { PolicyResolver } from "../policy-resolver";
import { ResourcePolicyDocument } from "./types";
import { ResourcePolicyValidator } from "./validator";

interface ResourcePolicyParserOptions {
  policyValidator?: ResourcePolicyValidator;
}

interface ParseInput {
  doc: ResourcePolicyDocument;
  targetEnvironment: string;
}

interface CreatePolicyStoreInput {
  policies: ResourcePolicyDocument[];
  targetEnvironment: string;
}

function parseResourcePolicy(
  params: ParseInput,
  opts: ResourcePolicyParserOptions = {}
): PolicyResolver {
  const { doc, targetEnvironment } = params;
  const validator = opts.policyValidator ?? new ResourcePolicyValidator();

  const allowedActions = doc.actions;

  validator.validate(doc);

  // Find all statements whose environment mentions either our targetEnvironment or '*' (global)
  const statements = doc.definitions
    .filter((def) => {
      if (Array.isArray(def.environment)) {
        return def.environment.some((env) =>
          ["*", targetEnvironment].includes(env)
        );
      } else {
        return ["*", targetEnvironment].includes(def.environment);
      }
    })
    .flatMap((def) => def.policies);

  return PolicyResolver.fromStatements(statements, { allowedActions });
}

export type ResourcePolicyStore = Map<string, PolicyResolver>;

export function createPolicyStore(
  input: CreatePolicyStoreInput
): ResourcePolicyStore {
  const policyStore: ResourcePolicyStore = new Map();

  input.policies.forEach((doc) => {
    if (policyStore.has(doc.resourceType)) {
      throw new Error(`already have definition for ${doc.resourceType}`);
    }

    policyStore.set(
      doc.resourceType,
      parseResourcePolicy({ doc, targetEnvironment: input.targetEnvironment })
    );
  });

  return policyStore;
}
