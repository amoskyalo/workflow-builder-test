export { StartNode } from "./StartNode";
export { ConditionNode } from "./ConditionNode";
export { DelayNode } from "./DelayNode";
export { WebhookNode } from "./WebhookNode";
export { LoggerNode } from "./LoggerNode";
export { EndNode } from "./EndNode";

import { StartNode } from "./StartNode";
import { ConditionNode } from "./ConditionNode";
import { DelayNode } from "./DelayNode";
import { WebhookNode } from "./WebhookNode";
import { LoggerNode } from "./LoggerNode";
import { EndNode } from "./EndNode";

export const nodeTypes = {
    start: StartNode,
    condition: ConditionNode,
    delay: DelayNode,
    webhook: WebhookNode,
    logger: LoggerNode,
    end: EndNode,
};
