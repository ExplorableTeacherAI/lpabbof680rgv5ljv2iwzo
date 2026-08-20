import { useRef, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineLinkedHighlight,
    InlineClozeInput,
    InlineClozeChoice,
    InlineFeedback,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure } from "@/components/molecules";
import { useVar, useSetVar } from "@/stores";
import { clamp } from "@/lib/motion";
import {
    getVariableInfo,
    clozePropsFromDefinition,
    choicePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";

// ── Scenario sorting figure ──────────────────────────────────────────────────

const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 350;
const CARD_HOME_X = 280;
const CARD_WIDTH = 180;
const CARD_HEIGHT = 104;
const CARD_TOP = 48;
const TRAY_TOP = 48;
const TRAY_HEIGHT = 104;
const LINE_Y = 220;
const LINE_X0 = 60;
const LINE_X1 = 520;
const GROUPING = "#62D0AD";
const REPEATING = "#8E90F5";
const ANSWER_HUE = "#F7B23B";
const INK = "#334155";
const INK_SOFT = "#64748B";

type ScenarioKind = "grouping" | "repeating";

interface Scenario {
    text: string;
    first: number;
    second: number;
    answer: number;
    kind: ScenarioKind;
    resultLabel: string;
}

const SCENARIOS: Scenario[] = [
    {
        text: "42 sandwiches and 28 cupcakes into identical lunch packs, none left over.",
        first: 42,
        second: 28,
        answer: 14,
        kind: "grouping",
        resultLabel: "14 packs",
    },
    {
        text: "Drinks refill every 9 minutes, snacks every 12. When do both refill together?",
        first: 9,
        second: 12,
        answer: 36,
        kind: "repeating",
        resultLabel: "36 minutes",
    },
    {
        text: "Crisps restock every 10 minutes, popcorn every 15. When are both restocked at once?",
        first: 10,
        second: 15,
        answer: 30,
        kind: "repeating",
        resultLabel: "30 minutes",
    },
    {
        text: "30 straws and 45 napkins split into identical table sets, using every one.",
        first: 30,
        second: 45,
        answer: 15,
        kind: "grouping",
        resultLabel: "15 sets",
    },
];

const wrapLines = (text: string, maxChars: number): string[] => {
    const lines: string[] = [];
    let current = "";
    for (const word of text.split(" ")) {
        if (current.length === 0) current = word;
        else if (`${current} ${word}`.length <= maxChars) current = `${current} ${word}`;
        else {
            lines.push(current);
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines;
};

function ScenarioSorterDrawing() {
    const setVar = useSetVar();
    const index = clamp(Math.round(useVar<number>("scenarioIndex", 0)), 0, SCENARIOS.length - 1);
    const verdict = useVar<string>("scenarioVerdict", "");
    const choice = useVar<string>("scenarioChoice", "");
    const highlight = useVar<string>("whichOneHighlight", "");
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startRef = useRef<{ pointer: number; offset: number }>({ pointer: 0, offset: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    const scenario = SCENARIOS[index];
    const solved = verdict === "correct";
    const dim = (id: string) => (highlight && highlight !== id ? 0.32 : 1);
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("whichOneHighlight", id),
        onPointerLeave: () => setVar("whichOneHighlight", ""),
    });

    const toViewX = (clientX: number) => {
        if (!svgRef.current) return 0;
        const rect = svgRef.current.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * VIEW_WIDTH;
    };

    const releaseCard = () => {
        setDragging(false);
        const center = CARD_HOME_X + dragX;
        let dropped: ScenarioKind | "" = "";
        if (center < 195) dropped = "grouping";
        else if (center > 365) dropped = "repeating";
        setDragX(0);
        if (!dropped) return;
        setVar("scenarioChoice", dropped);
        setVar("scenarioVerdict", dropped === scenario.kind ? "correct" : "wrong");
    };

    const scaleMax = Math.max(scenario.first, scenario.second, scenario.answer) * 1.12;
    const toLineX = (value: number) => LINE_X0 + (value / scaleMax) * (LINE_X1 - LINE_X0);

    const verdictText = solved
        ? scenario.kind === "grouping"
            ? `Sharing things out: ${scenario.resultLabel}, and the answer lands below both starting numbers.`
            : `Waiting for things to meet: ${scenario.resultLabel}, and the answer lands above both starting numbers.`
        : verdict === "wrong"
            ? choice === "repeating"
                ? "Not that tray. Waiting for things to repeat can only push the answer above the numbers you started with."
                : "Not that tray. Sharing things out can only give an answer below the numbers you started with."
            : "";

    const tray = (id: ScenarioKind, x: number, title: string, subtitle: string, hue: string) => {
        const active = highlight === id;
        const isTarget = verdict === "wrong" && choice === id;
        return (
            <g opacity={dim(id)} style={{ transition: "opacity 150ms ease-out" }} {...hoverProps(id)}>
                {active && (
                    <rect
                        x={x - 3}
                        y={TRAY_TOP - 3}
                        width={158}
                        height={TRAY_HEIGHT + 6}
                        rx={13}
                        fill="none"
                        stroke={hue}
                        strokeWidth={9}
                        opacity={0.28}
                    />
                )}
                <rect
                    x={x}
                    y={TRAY_TOP}
                    width={152}
                    height={TRAY_HEIGHT}
                    rx={10}
                    fill="#FFFFFF"
                    stroke={isTarget ? "#CBD5E1" : hue}
                    strokeWidth={active ? 3.5 : 2}
                    strokeDasharray={solved && scenario.kind === id ? undefined : "6 5"}
                    style={{ transition: "stroke-width 150ms ease-out" }}
                />
                <text x={x + 76} y={TRAY_TOP + 46} fontSize="13" textAnchor="middle" fill={INK}>
                    {title}
                </text>
                <text x={x + 76} y={TRAY_TOP + 66} fontSize="13" textAnchor="middle" fill={hue}>
                    {subtitle}
                </text>
            </g>
        );
    };

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            style={{ touchAction: "none" }}
        >
            <defs>
                <filter id="scenario-card-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.22" />
                </filter>
            </defs>

            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <text x={24} y={26} fill={INK_SOFT} fontSize="12">
                    {`Scenario ${index + 1} of ${SCENARIOS.length}`}
                </text>
            </g>

            {tray("grouping", 24, "Splitting into", "equal groups", GROUPING)}
            {tray("repeating", 384, "Repeating until", "they meet", REPEATING)}

            {/* The scenario card */}
            {!solved && (
                <g
                    opacity={highlight ? 0.45 : 1}
                    transform={`translate(${dragX} 0)`}
                    style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        startRef.current = { pointer: toViewX(event.clientX), offset: dragX };
                        setDragging(true);
                    }}
                    onPointerMove={(event) => {
                        if (!dragging) return;
                        const delta = toViewX(event.clientX) - startRef.current.pointer;
                        setDragX(clamp(startRef.current.offset + delta, -170, 170));
                    }}
                    onPointerUp={releaseCard}
                    onPointerCancel={releaseCard}
                >
                    <rect
                        x={CARD_HOME_X - CARD_WIDTH / 2}
                        y={CARD_TOP}
                        width={CARD_WIDTH}
                        height={CARD_HEIGHT}
                        rx={10}
                        fill="#FFFFFF"
                        stroke={INK_SOFT}
                        strokeWidth="2"
                        filter="url(#scenario-card-shadow)"
                    />
                    {(() => {
                        const lines = wrapLines(scenario.text, 24);
                        const firstY = CARD_TOP + CARD_HEIGHT / 2 - ((lines.length - 1) * 15) / 2 + 4;
                        return lines.map((line, position) => (
                            <text
                                key={position}
                                x={CARD_HOME_X}
                                y={firstY + position * 15}
                                fontSize="11"
                                textAnchor="middle"
                                fill={INK}
                            >
                                {line}
                            </text>
                        ));
                    })()}
                </g>
            )}

            {/* Where the answer lands next to the two starting numbers */}
            {solved && (
                <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                    <line x1={LINE_X0} y1={LINE_Y} x2={LINE_X1} y2={LINE_Y} stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                    {[scenario.first, scenario.second].map((value) => (
                        <g key={value}>
                            <line x1={toLineX(value)} y1={LINE_Y - 9} x2={toLineX(value)} y2={LINE_Y + 9} stroke={INK_SOFT} strokeWidth="2" strokeLinecap="round" />
                            <text
                                x={toLineX(value)}
                                y={LINE_Y - 18}
                                fontSize="12"
                                textAnchor="middle"
                                fill={INK_SOFT}
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {value}
                            </text>
                        </g>
                    ))}
                    <circle cx={toLineX(scenario.answer)} cy={LINE_Y} r={8} fill={ANSWER_HUE} />
                    <text
                        x={toLineX(scenario.answer)}
                        y={LINE_Y + 30}
                        fontSize="13"
                        textAnchor="middle"
                        fill={ANSWER_HUE}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        {scenario.resultLabel}
                    </text>
                </g>
            )}

            {/* What the drop taught */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                {wrapLines(verdictText, 62).map((line, position) => (
                    <text
                        key={position}
                        x={24}
                        y={280 + position * 17}
                        fontSize="12"
                        fill={solved ? INK : INK_SOFT}
                    >
                        {line}
                    </text>
                ))}
            </g>

            {/* Move on to the next card */}
            {solved && index === SCENARIOS.length - 1 && (
                <text x={VIEW_WIDTH - 24} y={326} fontSize="12" textAnchor="end" fill={GROUPING}>
                    All four scenarios sorted
                </text>
            )}

            {solved && index < SCENARIOS.length - 1 && (
                <g
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setVar("scenarioIndex", index + 1);
                        setVar("scenarioVerdict", "");
                        setVar("scenarioChoice", "");
                    }}
                >
                    <rect x={396} y={306} width={140} height={30} rx={8} fill="#FFFFFF" stroke={GROUPING} strokeWidth="2" />
                    <text x={466} y={326} fontSize="12" textAnchor="middle" fill={GROUPING}>
                        Next scenario
                    </text>
                </g>
            )}
        </svg>
    );
}

function ScenarioSorterFigure() {
    const setVar = useSetVar();
    return (
        <Figure
            id="scenario-sorter"
            onReset={() => {
                setVar("scenarioIndex", 0);
                setVar("scenarioVerdict", "");
                setVar("scenarioChoice", "");
                setVar("whichOneHighlight", "");
            }}
            caption="Drag the scenario card into the tray you think it belongs in. Land it correctly and the answer appears on a line beside the two numbers it came from."
        >
            <ScenarioSorterDrawing />
            <InteractionHintSequence
                hintKey="scenario-sorter-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the card into one of the two trays",
                        position: { x: "50%", y: "29%" },
                        dragPath: { type: "line", startOffset: { x: -34, y: 0 }, endOffset: { x: 34, y: 0 } },
                    },
                ]}
            />
        </Figure>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const whichOneSectionBlocks: ReactElement[] = [
    <StackLayout key="layout-which-one-heading" maxWidth="xl">
        <Block id="which-one-heading" padding="md">
            <EditableH2 id="h2-which-one-heading" blockId="which-one-heading">
                Which One Does This Question Need?
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-which-one-setup" maxWidth="xl">
        <Block id="which-one-setup" padding="sm">
            <EditableParagraph id="para-which-one-setup" blockId="which-one-setup">
                This is where marks quietly disappear, because both questions sound alike. Four
                snack stall scenarios are waiting, and each one belongs either to{" "}
                <InlineLinkedHighlight
                    varName="whichOneHighlight"
                    highlightId="grouping"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('whichOneHighlight'))}
                >
                    splitting into equal groups
                </InlineLinkedHighlight>{" "}
                or to{" "}
                <InlineLinkedHighlight
                    varName="whichOneHighlight"
                    highlightId="repeating"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('whichOneHighlight'))}
                >
                    repeating until they meet
                </InlineLinkedHighlight>
                . Commit the card to a tray before you work anything out.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-which-one-visual" maxWidth="xl">
        <Block id="which-one-visual" padding="sm" hasVisualization>
            <ScenarioSorterFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-which-one-reflect" maxWidth="xl">
        <Block id="which-one-reflect" padding="sm">
            <EditableParagraph id="para-which-one-reflect" blockId="which-one-reflect">
                Watch where the answer lands each time. Sharing things out always drops below both
                numbers, and waiting for things to meet always climbs above them, so the size of
                the answer tells you whether you chose the right one.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-which-one-question-hampers" maxWidth="xl">
        <Block id="which-one-question-hampers" padding="md">
            <EditableParagraph id="para-which-one-question-hampers" blockId="which-one-question-hampers">
                A baker packs 56 rolls and 70 pies into identical hampers with none left over, and
                wants as many hampers as possible. That question needs the{" "}
                <InlineFeedback
                    varName="answerHamperQuestionType"
                    correctValue="highest common factor"
                    position="terminal"
                    successMessage="— yes, the hampers are being shared out, so the answer has to be smaller than 56"
                    failureMessage="— that one would make the answer bigger than both numbers"
                    hint="Nothing is repeating here, the rolls and pies are simply being divided up"
                    visualizationHint={{
                        blockId: "which-one-visual",
                        hintKey: "feedback-scenario-sorter",
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Sort the first card, about lunch packs, and see which way its answer goes",
                                position: { x: "50%", y: "29%" },
                                dragPath: { type: "line", startOffset: { x: -34, y: 0 }, endOffset: { x: 34, y: 0 } },
                                completionVar: "scenarioIndex",
                                completionValue: 1,
                                completionTolerance: 0,
                            },
                        ],
                        label: "Discover it yourself",
                        resetVars: { scenarioIndex: 0, scenarioVerdict: "", scenarioChoice: "" },
                    }}
                >
                    <InlineClozeChoice
                        varName="answerHamperQuestionType"
                        correctAnswer="highest common factor"
                        options={["highest common factor", "lowest common multiple"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerHamperQuestionType'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-which-one-question-food-vans" maxWidth="xl">
        <Block id="which-one-question-food-vans" padding="md">
            <EditableParagraph id="para-which-one-question-food-vans" blockId="which-one-question-food-vans">
                Two food vans visit the market, one every 12 days and the other every 18 days. Both
                are there today, so they will next turn up on the same day in{" "}
                <InlineFeedback
                    varName="answerFoodVanDays"
                    correctValue="36"
                    position="terminal"
                    successMessage="days — exactly, and notice it is half of 12 times 18, because both vans share a 6"
                    failureMessage="days — try again"
                    hint="This one is a repeating question, so the answer has to be bigger than 18"
                    reviewBlockId="which-one-visual"
                    reviewLabel="Back to the sorting trays"
                >
                    <InlineClozeInput
                        varName="answerFoodVanDays"
                        correctAnswer="36"
                        {...clozePropsFromDefinition(getVariableInfo('answerFoodVanDays'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
