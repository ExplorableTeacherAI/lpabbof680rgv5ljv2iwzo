/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /**
     * Correct answer for cloze input validation.
     * Accepts a single string, pipe-separated alternates (e.g. "first | 1 | 1st"),
     * or an array of accepted answers (e.g. ["first", "1", "1st"]).
     */
    correctAnswer?: string | string[];
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // ADD YOUR VARIABLES HERE
    // ========================================

    // ─────────────────────────────────────────
    // SECTION: What a Number Is Made Of
    // ─────────────────────────────────────────
    snackRowWidth: {
        defaultValue: 5,
        type: 'number',
        label: 'Snacks per row',
        description: 'How many of the 24 snacks sit in each row of the tray',
        min: 3,
        max: 12,
        step: 1,
        color: '#62D0AD',
    },
    snackTrayHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Snack tray highlight',
        description: 'Which part of the snack tray is highlighted from the prose',
        color: '#F7B23B',
        bgColor: 'rgba(247, 178, 59, 0.2)',
    },
    answerRowSizeIsCalled: {
        defaultValue: '',
        type: 'select',
        label: 'Row size is called',
        description: 'Student answer: a row size that divides exactly is a factor',
        placeholder: '???',
        correctAnswer: 'factor',
        options: ['factor', 'multiple'],
        color: '#8E90F5',
    },
    // ─────────────────────────────────────────
    // SECTION: The Biggest Pack They Can Both Fill
    // ─────────────────────────────────────────
    partyBagCount: {
        defaultValue: 5,
        type: 'number',
        label: 'Party bags',
        description: 'How many identical party bags the chocolates and sweets are dealt into',
        min: 3,
        max: 12,
        step: 1,
        color: '#62D0AD',
    },
    partyBagHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Party bag highlight',
        description: 'Which part of the party bag figure is highlighted from the prose',
        color: '#F7B23B',
        bgColor: 'rgba(247, 178, 59, 0.2)',
    },
    answerBagsEighteenAndThirty: {
        defaultValue: '',
        type: 'text',
        label: 'Bags for 18 and 30',
        description: 'Student answer: the most identical bags from 18 balloons and 30 badges',
        placeholder: '???',
        correctAnswer: '6',
        color: '#8E90F5',
    },
    answerBiggerCleanPack: {
        defaultValue: '',
        type: 'text',
        label: 'Bigger clean pack',
        description: 'Student answer: the largest clean bag count for 20 pens and 30 rulers',
        placeholder: '???',
        correctAnswer: '10',
        color: '#8E90F5',
    },

    // ─────────────────────────────────────────
    // SECTION: The First Time They Line Up Again
    // ─────────────────────────────────────────
    refillTime: {
        defaultValue: 40,
        type: 'number',
        label: 'Minutes on the clock',
        description: 'How far the clock has been wound forward along the refill timeline',
        unit: 'min',
        min: 0,
        max: 120,
        step: 1,
        color: '#62D0AD',
    },
    refillHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Refill lane highlight',
        description: 'Which refill lane is highlighted from the prose',
        color: '#F7B23B',
        bgColor: 'rgba(247, 178, 59, 0.2)',
    },
    answerFirstMeetingSixEight: {
        defaultValue: '',
        type: 'text',
        label: 'First meeting of 6 and 8',
        description: 'Student answer: when 6-minute and 8-minute timers first refill together',
        placeholder: '???',
        correctAnswer: '24',
        color: '#8E90F5',
    },
    answerFirstMeetingTenFifteen: {
        defaultValue: '',
        type: 'text',
        label: 'First meeting of 10 and 15',
        description: 'Student answer: when 10-minute and 15-minute timers first refill together',
        placeholder: '???',
        correctAnswer: '30',
        color: '#8E90F5',
    },

    // ─────────────────────────────────────────
    // SECTION: Which One Does This Question Need?
    // ─────────────────────────────────────────
    scenarioIndex: {
        defaultValue: 0,
        type: 'number',
        label: 'Scenario',
        description: 'Which snack pack scenario card is currently on the table',
        min: 0,
        max: 3,
        step: 1,
        color: '#62D0AD',
    },
    scenarioVerdict: {
        defaultValue: '',
        type: 'text',
        label: 'Scenario verdict',
        description: 'Whether the current scenario card landed in the right tray',
    },
    scenarioChoice: {
        defaultValue: '',
        type: 'text',
        label: 'Scenario choice',
        description: 'Which tray the student dropped the current scenario card into',
    },
    whichOneHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Sorting tray highlight',
        description: 'Which sorting tray is highlighted from the prose',
        color: '#F7B23B',
        bgColor: 'rgba(247, 178, 59, 0.2)',
    },
    answerHamperQuestionType: {
        defaultValue: '',
        type: 'select',
        label: 'Hamper question type',
        description: 'Student answer: which of HCF or LCM the hamper question needs',
        placeholder: '???',
        correctAnswer: 'highest common factor',
        options: ['highest common factor', 'lowest common multiple'],
        color: '#8E90F5',
    },
    answerFoodVanDays: {
        defaultValue: '',
        type: 'text',
        label: 'Food van days',
        description: 'Student answer: when 12-day and 18-day food vans next arrive together',
        placeholder: '???',
        correctAnswer: '36',
        color: '#8E90F5',
    },

    answerRowSizeBetweenSevenAndEleven: {
        defaultValue: '',
        type: 'text',
        label: 'Row size between 7 and 11',
        description: 'Student answer: the only row size between 7 and 11 that packs 24 exactly',
        placeholder: '???',
        correctAnswer: '8',
        color: '#8E90F5',
    },

    // Uncomment and modify these examples for your lesson:

    /*
    // ─────────────────────────────────────────
    // NUMBER - Use with sliders
    // ─────────────────────────────────────────
    myValue: {
        defaultValue: 5,
        type: 'number',
        label: 'My Value',
        description: 'A number that controls something',
        unit: 'm',           // optional unit display
        min: 0,
        max: 10,
        step: 0.5,
    },

    // ─────────────────────────────────────────
    // TEXT - Free text input
    // ─────────────────────────────────────────
    lessonTitle: {
        defaultValue: 'My Lesson',
        type: 'text',
        label: 'Lesson Title',
        description: 'The title of your lesson',
        placeholder: 'Enter a title...',
    },

    // ─────────────────────────────────────────
    // SELECT - Dropdown with options
    // ─────────────────────────────────────────
    difficulty: {
        defaultValue: 'medium',
        type: 'select',
        label: 'Difficulty',
        description: 'The difficulty level of the lesson',
        options: ['easy', 'medium', 'hard', 'expert'],
    },

    // ─────────────────────────────────────────
    // BOOLEAN - Toggle switch
    // ─────────────────────────────────────────
    showHints: {
        defaultValue: true,
        type: 'boolean',
        label: 'Show Hints',
        description: 'Toggle to show or hide hints',
    },

    // ─────────────────────────────────────────
    // ARRAY - List of numbers
    // ─────────────────────────────────────────
    dataPoints: {
        defaultValue: [1, 4, 9, 16, 25],
        type: 'array',
        label: 'Data Points',
        description: 'Y-values for plotting a graph',
    },

    // ─────────────────────────────────────────
    // OBJECT - Complex structured data
    // ─────────────────────────────────────────
    graphSettings: {
        defaultValue: { 
            xMin: -10, 
            xMax: 10, 
            showGrid: true 
        },
        type: 'object',
        label: 'Graph Settings',
        description: 'Configuration for the graph display',
        schema: '{ xMin: number, xMax: number, showGrid: boolean }',
    },
    */
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
