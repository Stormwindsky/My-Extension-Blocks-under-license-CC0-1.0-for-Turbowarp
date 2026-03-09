// Name: Variables set all
// ID: variablesSetAll
// Description: Global control for ALL variables at once (set, change, show, hide).
// License: CC0 1.0 Universal

(function(Scratch) {
    'use strict';

    class VariablesSetAll {
        getInfo() {
            return {
                id: 'variablesSetAll',
                name: 'Variables set all',
                color1: '#ff8c1a',
                color2: '#db6e00',
                blocks: [
                    {
                        opcode: 'setEveryVariableTo',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set all variables to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '0'
                            }
                        }
                    },
                    {
                        opcode: 'changeEveryVariableBy',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change all variables by [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '1'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'showEveryVariable',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'show all variables'
                    },
                    {
                        opcode: 'hideEveryVariable',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide all variables'
                    }
                ]
            };
        }

        setEveryVariableTo(args) {
            const value = args.VALUE;
            const targets = Scratch.vm.runtime.targets;
            for (const target of targets) {
                for (const id in target.variables) {
                    target.variables[id].value = value;
                }
            }
        }

        changeEveryVariableBy(args) {
            const change = parseFloat(args.VALUE) || 0;
            const targets = Scratch.vm.runtime.targets;
            for (const target of targets) {
                for (const id in target.variables) {
                    const variable = target.variables[id];
                    const oldValue = parseFloat(variable.value) || 0;
                    variable.value = oldValue + change;
                }
            }
        }

        showEveryVariable() {
            this._updateAllVisibility(true);
        }

        hideEveryVariable() {
            this._updateAllVisibility(false);
        }

        _updateAllVisibility(visible) {
            const runtime = Scratch.vm.runtime;
            const targets = runtime.targets;
            for (const target of targets) {
                for (const id in target.variables) {
                    // This updates the checkbox state in the editor and on stage
                    runtime.monitorBlocks.changeBlock({
                        id: id,
                        element: 'checkbox',
                        value: visible
                    }, runtime);
                }
            }
        }
    }

    Scratch.extensions.register(new VariablesSetAll());
})(Scratch);