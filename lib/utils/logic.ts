import jsonLogic, { RulesLogic } from "json-logic-js";

type Path = (string | number)[];
/**
 * callback function invoked on matching operations (or all if unspecified)
 *
 * return false if you want to stop traversal, otherwise traversal continues
 */
type VisitorFn = (match: RulesLogic, path: Path) => boolean | void;

type InnerTraverseParams = {
  visitor: VisitorFn;
  operations?: string[];
  path: Path;
};

function _traverseRulesLogic(
  logic: RulesLogic,
  params: InnerTraverseParams
): void {
  // we only want Rule objects, not primitives
  if (typeof logic !== "object") {
    return;
  }
  if (!jsonLogic.is_logic(logic)) {
    return;
  }
  const { visitor, operations, path } = params;

  const op = jsonLogic.get_operator(logic);
  const thisPath = [...path, op];

  let continueDescending = true;
  if (operations && operations.includes(op)) {
    // make a copy
    continueDescending = visitor(logic, [...thisPath]) ?? true;
  }
  if (!continueDescending) {
    return;
  }

  const val: RulesLogic = (logic as Record<string, any | any[]>)[op];
  const isArr = Array.isArray(val);
  const operands = isArr ? val : [val];

  let i = 0;
  for (const operand of operands) {
    const nextPath = isArr ? [...thisPath, i] : thisPath;
    _traverseRulesLogic(operand, { visitor, operations, path: nextPath });
    i++;
  }
}

/**
 * traverses the rules logic breadth first and invokes the visitor
 *
 * an optional third parameter allows for filtering operations that are sent to the visitor
 *
 * @param logic
 * @param visitor
 * @param operations
 */
export function traverseRulesLogic(
  logic: RulesLogic,
  visitor: VisitorFn,
  operations?: string[]
): void {
  _traverseRulesLogic(logic, { visitor, operations, path: [] });
}
