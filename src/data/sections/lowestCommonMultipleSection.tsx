import { useRef, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineLinkedHighlight,
    InlineClozeInput,
    InlineFeedback,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure } from "@/components/molecules";
import { useVar, useSetVar } from "@/stores";
import { clamp } from "@/lib/motion";
import {
    getVariableInfo,
    clozePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";

// ── Refill timeline figure ───────────────────────────────────────────────────

const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 300;
const TRACK_X0 = 120;
const TRACK_X1 = 520;
const MAX_MINUTES = 120;
const PERIOD_A = 24;
const PERIOD_B = 36;
const MEETING = 72;
const LANE_A_Y = 104;
const LANE_B_Y = 176;
const HANDLE_TOP = 70;
const HANDLE_BOTTOM = 200;
const AXIS_Y = 210;
const MACHINE_A = "#62D0AD";
const MACHINE_B = "#8E90F5";
const MEETING_HUE = "#F7B23B";
const INK = "#334155";
const INK_SOFT = "#64748B";

const toX = (minutes: number) => TRACK_X0 + (minutes / MAX_MINUTES) * (TRACK_X1 - TRACK_X0);

function RefillTimelineDrawing() {
    const setVar = useSetVar();
    const now = clamp(Math.round(useVar<number>("refillTime", 40)), 0, MAX_MINUTES);
    const highlight = useVar<string>("refillHighlight", "");
    const [dragging, setDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const hasMet = now >= MEETING;
    const dim = (id: string) => (highlight && highlight !== id ? 0.32 : 1);
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("refillHighlight", id),
        onPointerLeave: () => setVar("refillHighlight", ""),
    });

    const marksFor = (period: number) =>
        Array.from({ length: Math.floor(now / period) }, (_, index) => (index + 1) * period);

    const setTimeFromPointer = (clientX: number) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const pointerX = ((clientX - rect.left) / rect.width) * VIEW_WIDTH;
        const minutes = ((pointerX - TRACK_X0) / (TRACK_X1 - TRACK_X0)) * MAX_MINUTES;
        setVar("refillTime", clamp(Math.round(minutes), 0, MAX_MINUTES));
    };

    const lane = (
        id: string,
        name: string,
        period: number,
        laneY: number,
        hue: string,
    ) => (
        <g opacity={dim(id)} style={{ transition: "opacity 150ms ease-out" }} {...hoverProps(id)}>
            <text x={24} y={laneY - 9} fill={INK} fontSize="12">
                {name}
            </text>
            <text x={24} y={laneY + 7} fill={hue} fontSize="11">
                {`every ${period} min`}
            </text>
            <line
                x1={TRACK_X0}
                y1={laneY}
                x2={TRACK_X1}
                y2={laneY}
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {marksFor(period).map((minute) => {
                const isMeeting = minute === MEETING;
                const active = highlight === id;
                return (
                    <g key={minute}>
                        {active && (
                            <rect
                                x={toX(minute) - 7}
                                y={laneY - 26}
                                width={14}
                                height={30}
                                rx={7}
                                fill="none"
                                stroke={hue}
                                strokeWidth={8}
                                opacity={0.28}
                            />
                        )}
                        <rect
                            x={toX(minute) - 3}
                            y={laneY - 22}
                            width={6}
                            height={22}
                            rx={3}
                            fill={isMeeting && hasMet ? MEETING_HUE : hue}
                            stroke={isMeeting && hasMet ? MEETING_HUE : hue}
                            strokeWidth={active ? 2.5 : 0}
                            style={{ transition: "stroke-width 150ms ease-out" }}
                        />
                    </g>
                );
            })}
        </g>
    );

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            style={{ touchAction: "none" }}
        >
            <defs>
                <filter id="refill-handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Readouts */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <text x={24} y={32} fill={INK} fontSize="15" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {`${now} min on the clock`}
                </text>
                <text
                    x={VIEW_WIDTH - 24}
                    y={32}
                    fill={hasMet ? MEETING_HUE : INK_SOFT}
                    fontSize="12"
                    textAnchor="end"
                >
                    {hasMet ? "Both machines refilled together at 72 min" : "They have not lined up yet"}
                </text>
            </g>

            {lane("machineA", "Machine A", PERIOD_A, LANE_A_Y, MACHINE_A)}
            {lane("machineB", "Machine B", PERIOD_B, LANE_B_Y, MACHINE_B)}

            {/* The moment both fire at once */}
            {hasMet && (
                <g opacity={dim("meeting")} style={{ transition: "opacity 150ms ease-out" }} {...hoverProps("meeting")}>
                    <line
                        x1={toX(MEETING)}
                        y1={LANE_A_Y - 22}
                        x2={toX(MEETING)}
                        y2={LANE_B_Y}
                        stroke={MEETING_HUE}
                        strokeWidth={highlight === "meeting" ? 4 : 2.5}
                        strokeLinecap="round"
                        style={{ transition: "stroke-width 150ms ease-out" }}
                    />
                </g>
            )}

            {/* Axis */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <line x1={TRACK_X0} y1={AXIS_Y} x2={TRACK_X1} y2={AXIS_Y} stroke="#CBD5E1" strokeWidth="1.5" />
                {[0, 24, 48, 72, 96, 120].map((minute) => (
                    <g key={minute}>
                        <line
                            x1={toX(minute)}
                            y1={AXIS_Y}
                            x2={toX(minute)}
                            y2={AXIS_Y + 6}
                            stroke="#CBD5E1"
                            strokeWidth="1.5"
                        />
                        <text
                            x={toX(minute)}
                            y={AXIS_Y + 22}
                            fontSize="11"
                            textAnchor="middle"
                            fill={INK_SOFT}
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {minute}
                        </text>
                    </g>
                ))}
                <text x={VIEW_WIDTH - 24} y={268} fontSize="11" textAnchor="end" fill={INK_SOFT}>
                    24 x 36 = 864 min, far off the right of this clock
                </text>
            </g>

            {/* Draggable clock marker */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <line
                    x1={toX(now)}
                    y1={HANDLE_TOP}
                    x2={toX(now)}
                    y2={HANDLE_BOTTOM}
                    stroke={INK_SOFT}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <circle cx={toX(now)} cy={HANDLE_TOP} r={9} fill={MACHINE_A} filter="url(#refill-handle-shadow)" />
                <rect
                    x={toX(now) - 20}
                    y={HANDLE_TOP - 22}
                    width={40}
                    height={HANDLE_BOTTOM - HANDLE_TOP + 44}
                    fill="transparent"
                    style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setDragging(true);
                    }}
                    onPointerMove={(event) => {
                        if (dragging) setTimeFromPointer(event.clientX);
                    }}
                    onPointerUp={() => setDragging(false)}
                    onPointerCancel={() => setDragging(false)}
                />
            </g>
        </svg>
    );
}

function RefillTimelineFigure() {
    const setVar = useSetVar();
    return (
        <Figure
            id="refill-timeline"
            onReset={() => {
                setVar("refillTime", 40);
                setVar("refillHighlight", "");
            }}
            caption="Drag the marker to wind the clock forward. Each machine leaves a mark behind every time it refills, so the gaps between them are easy to compare."
        >
            <RefillTimelineDrawing />
            <InteractionHintSequence
                hintKey="refill-timeline-wind"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the marker forward through the clock",
                        position: { x: "45%", y: "23%" },
                        dragPath: { type: "line", startOffset: { x: -30, y: 0 }, endOffset: { x: 30, y: 0 } },
                    },
                ]}
            />
        </Figure>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const lowestCommonMultipleSectionBlocks: ReactElement[] = [
    <StackLayout key="layout-lowest-common-multiple-heading" maxWidth="xl">
        <Block id="lowest-common-multiple-heading" padding="md">
            <EditableH2 id="h2-lowest-common-multiple-heading" blockId="lowest-common-multiple-heading">
                The First Time They Line Up Again
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-setup" maxWidth="xl">
        <Block id="lowest-common-multiple-setup" padding="sm">
            <EditableParagraph id="para-lowest-common-multiple-setup" blockId="lowest-common-multiple-setup">
                This question runs the opposite way: not the biggest number hiding inside both, but
                the smallest number both of them fit into. One snack machine refills{" "}
                <InlineLinkedHighlight
                    varName="refillHighlight"
                    highlightId="machineA"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('refillHighlight'))}
                >
                    every 24 minutes
                </InlineLinkedHighlight>
                , another{" "}
                <InlineLinkedHighlight
                    varName="refillHighlight"
                    highlightId="machineB"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('refillHighlight'))}
                >
                    every 36 minutes
                </InlineLinkedHighlight>
                . Drag the marker along the clock and hunt for the first moment they fire together.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-visual" maxWidth="xl">
        <Block id="lowest-common-multiple-visual" padding="sm" hasVisualization>
            <RefillTimelineFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-reflect" maxWidth="xl">
        <Block id="lowest-common-multiple-reflect" padding="sm">
            <EditableParagraph id="para-lowest-common-multiple-reflect" blockId="lowest-common-multiple-reflect">
                They meet at 72 minutes, not at 864. Multiplying the two timers together always
                gets you a moment they share, but it counts everything the two have in common
                twice, so it lands far later than it needs to.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-question-six-eight" maxWidth="xl">
        <Block id="lowest-common-multiple-question-six-eight" padding="md">
            <EditableParagraph id="para-lowest-common-multiple-question-six-eight" blockId="lowest-common-multiple-question-six-eight">
                Swap in two faster machines, one on a 6 minute timer and one on 8 minutes. Counting
                from the moment they both start, the first time they refill together is at{" "}
                <InlineFeedback
                    varName="answerFirstMeetingSixEight"
                    correctValue="24"
                    position="terminal"
                    successMessage="minutes — exactly, and notice that is well short of 6 times 8"
                    failureMessage="minutes — have another go"
                    hint="Count up in sixes and in eights, and stop at the first number that appears in both lists"
                    visualizationHint={{
                        blockId: "lowest-common-multiple-visual",
                        hintKey: "feedback-refill-timeline-meet",
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Wind the clock past 48 minutes — still no moment they share",
                                position: { x: "50%", y: "23%" },
                                dragPath: { type: "line", startOffset: { x: -26, y: 0 }, endOffset: { x: 26, y: 0 } },
                                completionVar: "refillTime",
                                completionValue: 48,
                                completionTolerance: 4,
                            },
                            {
                                gesture: "drag-horizontal",
                                label: "Keep winding until two marks finally land on the same moment",
                                position: { x: "64%", y: "23%" },
                                dragPath: { type: "line", startOffset: { x: -26, y: 0 }, endOffset: { x: 26, y: 0 } },
                                completionVar: "refillTime",
                                completionValue: 72,
                                completionTolerance: 4,
                            },
                        ],
                        label: "Discover it yourself",
                        resetVars: { refillTime: 0 },
                    }}
                >
                    <InlineClozeInput
                        varName="answerFirstMeetingSixEight"
                        correctAnswer="24"
                        {...clozePropsFromDefinition(getVariableInfo('answerFirstMeetingSixEight'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-question-ten-fifteen" maxWidth="xl">
        <Block id="lowest-common-multiple-question-ten-fifteen" padding="md">
            <EditableParagraph id="para-lowest-common-multiple-question-ten-fifteen" blockId="lowest-common-multiple-question-ten-fifteen">
                Someone with a 10 minute machine and a 15 minute machine works out that they meet
                after 150 minutes. That does happen, but they will already have met much earlier,
                at{" "}
                <InlineFeedback
                    varName="answerFirstMeetingTenFifteen"
                    correctValue="30"
                    position="terminal"
                    successMessage="minutes — right, and 150 is simply the fifth time it happens, not the first"
                    failureMessage="minutes — not that one"
                    hint="10 and 15 both share a 5, so the meeting comes round five times sooner than 150"
                    reviewBlockId="lowest-common-multiple-visual"
                    reviewLabel="Back to the clock"
                >
                    <InlineClozeInput
                        varName="answerFirstMeetingTenFifteen"
                        correctAnswer="30"
                        {...clozePropsFromDefinition(getVariableInfo('answerFirstMeetingTenFifteen'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
