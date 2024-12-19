declare function beforeRunHook(): Promise<void>;
declare function afterRunHook(results: any): Promise<void>;
export { afterRunHook, beforeRunHook };
