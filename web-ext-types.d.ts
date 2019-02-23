/**
 * Types that are missing from the NPM packages
 */

declare namespace browser.commands {
    function getAll(): Promise<Command[]>;
    function update(details: Command): Promise<void>;
    function reset(name: string): Promise<void>;
}
