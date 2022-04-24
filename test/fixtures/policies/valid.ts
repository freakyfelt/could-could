import { type ResourcePolicyDocument } from "../../..";

export const BasicResourcePolicy: ResourcePolicyDocument = {
  resource: "FooResource",
  actions: ["create", "read", "update", "delete"],
  definitions: [
    {
      environment: "*",
      policies: [
        {
          action: "create",
          effect: "allow",
          constraint: true,
        },
      ],
    },
  ],
};

export const MultipleActionsPolicy: ResourcePolicyDocument = {
  resource: "FooResource",
  actions: ["create", "read", "update", "delete"],
  definitions: [
    {
      environment: "*",
      policies: [
        {
          action: ["create", "read"],
          effect: "allow",
          constraint: true,
        },
      ],
    },
  ],
};

export const SimpleEnvironmentDenyPolicy: ResourcePolicyDocument = {
  ...BasicResourcePolicy,
  definitions: [
    ...BasicResourcePolicy.definitions,
    {
      environment: 'production',
      policies: [
        {
          action: 'create',
          effect: 'deny',
          constraint: true
        }
      ]
    }
  ]
}

export const BasicContextualResourcePolicy: ResourcePolicyDocument = {
  ...BasicResourcePolicy,
  definitions: [
    ...BasicResourcePolicy.definitions,
    {
      environment: 'production',
      policies: [
        {
          action: 'create',
          effect: 'deny',
          constraint: {
            '==': [
              { var: 'subject.id' },
              { var: 'doc.createdBy' }
            ]
          }
        }
      ]
    }
  ]
}

export const InContextResourcePolicy: ResourcePolicyDocument = {
  ...BasicContextualResourcePolicy,
  definitions: [
    ...BasicResourcePolicy.definitions,
    {
      environment: 'production',
      policies: [
        {
          action: 'create',
          effect: 'deny',
          constraint: {
            some: [
              { var: 'subject.groups' },
              { in: [{ var: '' }, ['group1', 'group5']]}
            ]
          }
        }
      ]
    }
  ]
}
