# @freakyfelt/could-could

could-could is yet another authorization library built atop [JsonLogic](https://jsonlogic.com), a JSON-based schema and library that allows for conditional statements to be defined and evaluated against a context. This allows for more complex rules based on who the principal (e.g. user/service) is, what state a resource is in (e.g. block an action if the resource is in a `closed` state), or a combination of factors. The same policy can then be consumed in frontend apps as well as backend apps, potentially in any language supported by JsonLogic.

## Features

- Generates the set of policies ahead of time for predictable performance
- Provides for both `allow` and `deny` constraints. `deny` constraints will always take precedence
- Allows for a context to be provided when evaluating the policy, allowing for more complex conditional logic
- Uses a portable [JSONSchema](./schemas/resource-policy-2023-02.schema.json) for validating the shape of the policies
- Can extend JsonLogic with custom functions if needed (not recommended as you will need to implement the same functions in each consumer of the policy)

## Terms

- `action`: patterns to match for action(s) that could be requested (e.g. `create`, `kitties:PetKitty`)
  - Patterns can be specified as a single string or an array of strings
  - Patterns can be exact matches, match all actions (`'*'`), or starts with/ends with using `'*'` as a glob operator
- `effect`: what the result should be if the `constraint` is true
- `constraint`: the rules that will be evaluated to determine if the effect should apply
- `context`: the extra data that can be provided to make decisions, such as a principal (e.g. user/service object) or the resource in question

## Defining a policy

You will need a few pieces of information up front when creating a collection of policies:

1. a list of actions that are permitted for each resource type. All other actions will evaluate to `false`
  - TIP: use a namespacing scheme such as `documents:deleteDocument` to group actions by domain
1. what information will be available in the context when evaluating an action

```jsonc
// example policy stored somewhere that can be consumed at runtime
{
  "policies": [
    {
      "description": "Allow everyone to create a kitty",
      "action": "kitty:create", // specify a single action
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
      "action": ["kitty:read", "kitty:update", "kitty:pet"], // specify a list of actions
      "effect": "allow",
      "constraint": {
        "===": [
          { "var": "subject.id" },
          { "var": "kitty.ownerId" }
        ]
      }
    },
    {
      "description": "only allow non-owners to look at the kitty",
      // use globs to match all characters at the start or end
      "action": ["kitty:read", "kitty:get*", "kitty:list*"], 
      "effect": "allow",
      "constraint": {
        "!==": [
          { "var": "subject.id" },
          { "var": "kitty.ownerId" },
        ]
      }
    },
    {
      "description": "Do not allow users (even admins!) to pet if the kitty is sleeping or eating",
      "action": "kitty:pet",
      "effect": "deny", // will override any allow statement
      "constraint": {
        "in": [
          { "var": "kitty.state" },
          ["eating", "sleeping"]
        ]
      }
    }
  ]
}
```

Next, in the consuming application create a resolver and make it available for use:

```ts
import { PolicyResolver } from '@freakyfelt/could-could'

const resolver = PolicyResolver.fromDocuments(policies)

// ...then at runtime
function petKitty(kitty: Kitty, { subject }: RequestContext) {
  if (!resolver.can('kitty:pet', { kitty, subject })) {
    throw new NotAuthorizedError()
  }
}
```

## Custom boolean evaluators

JsonLogic supports adding custom boolean evaluators by using `JsonLogic.add_operation()`. Unfortunately the library is a singleton, meaning you cannot create isolated instances of JsonLogic with their own operations.

## Contributing

This library is mostly a proof of concept, but if you find it useful definitely fork and submit a PR against this repository. The project uses `prettier` and `jest` for linting and testing respectively. You can run tests, linting, and build by using `npm run release`.

The package is broken into four major areas: the validator, the parser, the store, and the resolver.

* the validator checks that the provided policy document matches the schema and has an evaluatable set of constraints
* the parser does the heavy lifting of turning a policy statement into the internal shape ("ParsedPolicyStatement")
* the store handles storing, indexing, and finding parsed statements matching a given action
* the resolver handles the runtime evaluation logic based on the provided action and context
