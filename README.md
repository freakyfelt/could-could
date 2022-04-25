# @freakyfelt/could-could

could-could is yet another authorization library built atop [JsonLogic](https://jsonlogic.com), a JSON-based schema and library that allows for boolean algebra to defined and executed against a context. This allows for more complex rules based on who the principal (e.g. user/service) is, what state a resource is in (e.g. block an action if the resource is in a `closed` state), or a combination of factors. The same policy can then be consumed in frontend apps as well as backend apps, potentially in any language supported by JsonLogic.

## Features

- Compiles policies at resolver create time for predictable performance
- Allows for defining policies across `environments` (e.g. `development`, `production-use1`, etc) as well as `actions` (e.g. `create`, `kitty:PetKitty`, etc) on a given resource type. Policies will be merged with an `or` so any one matching policy is sufficient
- Provides for both `allow` and `deny` constraints. `deny` constraints will always take precedence
- Allows for a context to be provided when evaluating the policy, allowing for more complex conditional logic
- Uses a portable [JSONSchema](lib/validator/schema.json) for validating the shape of the policies
- Can extend JsonLogic with custom functions if needed (not recommended as you will need to implement the same functions in each consumer of the policy)

## Terms

- `resourceType`: an identifier for a type of entity to validate (e.g. `BlogPost`, `com.kitties.Kitty`)
- `environment`: an arbitrary identifier for an operating context, allowing for different constraints in `test`, non-production (e.g. `alpha`, `preview`), or different regions of `production` (e.g. `production-use1`)
- `action`: an identifier of what kind of action is being requested (e.g. `create`, `kittes:PetKitty`). Actions can be specified as a single action, an array of actions, or `*` which will match any action.
- `effect`: what the result should be if the `constraint` is true
- `constraint`: the rules that will be evaluated to determine if an action can occur
- `context`: the extra data that can be provided to make decisions, such as a principal (e.g. user/service object) or the resource in question

## Defining a policy

You will need a few pieces of information up front when creating a collection of policies:

1. a resource type naming convention
1. a list of actions that are permitted for each resource type. All other actions will evaluate to `false`
1. what environments you plan to use across all resource types, such as `development`, `test`, `beta`, `production`
1. what information will be available in the context when evaluating an action

```jsonc
// example policy stored somewhere that can be consumed at runtime
{
  "resourceType": "Kitty",
  "actions": ["create", "read", "update", "pet"],
  "definitions": [
    {
      "environment": "*", // applies across all environments
      "policies": [
        {
          "description": "Allow everyone to create a kitty",
          "action": "create", // specify a single action
          "effect": "allow",
          "constraint": true
        },
        {
          "description": "Allow admins to take any action",
          "action": "*",
          "effect": "allow",
          "constraint": {
            // expects that context will include a subject object with a role property
            "===": [
              { "var": "subject.role" },
              "admin"
            ]
          }
        },
        {
          "description": "allow owners to read, update and pet the kitty",
          "action": ["read", "update", "pet"], // specify a list of actions
          "effect": "allow",
          "constraint": {
            "===": [
              { "var": "subject.id" },
              { "var": "kitty.ownerId" }
            ]
          }
        }
        {
          "description": "Do not allow users to pet if the kitty is sleeping or eating",
          "action": "pet",
          "effect": "deny", // will override any allow statement
          "constraint": {
            "in": [
              { "var": "kitty.state" },
              ["eating", "sleeping"]
            ]
          }
        }
      ]
    },
    {
      "environment": ["development", "alpha", "beta"], // specify a list of environments
      "policies": [
        {
          "description": "allow developers to update any kitty in non-prod environments",
          "action": "update",
          "effect": "allow",
          "constraint": true
        }
      ]
    }
  ]
}
```

Next, in the consuming application create a resolver and make it available for use:

```ts
import { createPolicyResolver } from '@freakyfelt/could-could'

const resolver = createPolicyResolver({ policies, targetEnvironment: process.env.NODE_ENV })

// ...then at runtime
function petKitty(kitty: Kitty, { subject }: RequestContext) {
  if (!resolver.can({ action: 'pet', resourceType: 'Kitty' }, { kitty, subject })) {
    throw new NotAuthorizedError()
  }
}
```

## Custom boolean evaluators

JsonLogic supports adding custom boolean evaluators by using `JsonLogic.add_operation()`. Unfortunately the library is a singleton, meaning you cannot create isolated instances of JsonLogic with their own operations.

## Contributing

This library is mostly a proof of concept, but if you find it useful definitely fork and submit a PR against this repository. The project uses `prettier` and `jest` for linting and testing respectively. You can run tests, linting, and build by using `npm run release`.
