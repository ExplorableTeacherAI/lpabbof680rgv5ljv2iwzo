import { useEffect, useRef, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
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
} from "../variables";

// ── Snack tray figure ────────────────────────────────────────────────────────

const TOTAL_SNACKS = 24;
const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 360;
const GRID_X = 60;
const GRID_Y = 104;
const PITCH = 28;
const HANDLE_GAP = 18;
const ACCENT = "#62D0AD";
const INK = "#334155";
const INK_SOFT = "#64748B";
const LEFTOVER_FILL = "#E2E8F0";
const LEFTOVER_STROKE = "#94A3B8";
const ROW_SIZES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function SnackTrayDrawing() {
    const setVar = useSetVar();
    const rowWidth = clamp(Math.round(useVar<number>("snackRowWidth", 5)), 3, 12);
    const highlight = useVar<string>("snackTrayHighlight", "");
    const found = useVar<string>("snackFactorsFound", "");
    const [dragging, setDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const fullRows = Math.floor(TOTAL_SNACKS / rowWidth);
    const leftover = TOTAL_SNACKS % rowWidth;
    const totalRows = fullRows + (leftover > 0 ? 1 : 0);
    const isPerfect = leftover === 0;

    // Trace: every row size that has packed the tray exactly stays recorded.
    const foundList = found ? found.split(",").filter(Boolean).map(Number) : [];
    useEffect(() => {
        if (!isPerfect) return;
        const recorded = found ? found.split(",").filter(Boolean).map(Number) : [];
        if (recorded.includes(rowWidth)) return;
        setVar("snackFactorsFound", [...recorded, rowWidth].sort((a, b) => a - b).join(","));
    }, [isPerfect, rowWidth, found, setVar]);

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("snackTrayHighlight", id),
        onPointerLeave: () => setVar("snackTrayHighlight", ""),
    });

    const handleX = GRID_X + rowWidth * PITCH + HANDLE_GAP;
    const gridHeight = totalRows * PITCH;
    const handleY = GRID_Y + gridHeight / 2;

    const setWidthFromPointer = (clientX: number) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const pointerX = ((clientX - rect.left) / rect.width) * VIEW_WIDTH;
        const next = Math.round((pointerX - GRID_X - HANDLE_GAP) / PITCH);
        setVar("snackRowWidth", clamp(next, 3, 12));
    };

    const snacks = Array.from({ length: TOTAL_SNACKS }, (_, index) => {
        const column = index % rowWidth;
        const row = Math.floor(index / rowWidth);
        return {
            index,
            x: GRID_X + column * PITCH + PITCH / 2,
            y: GRID_Y + row * PITCH + PITCH / 2,
            isLeftover: index >= fullRows * rowWidth,
        };
    });

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full"
            style={{ touchAction: "none" }}
        >
            <defs>
                <filter id="snack-handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Readout — one formatter, tabular numerals */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <text x={24} y={34} fill={INK_SOFT} fontSize="12">
                    24 snacks on the tray
                </text>
                <text
                    x={24}
                    y={62}
                    fill={ACCENT}
                    fontSize="15"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {`${rowWidth} in each row`}
                </text>
                <text
                    x={24}
                    y={84}
                    fill={isPerfect ? INK : LEFTOVER_STROKE}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {isPerfect
                        ? `${fullRows} full rows, none left over`
                        : `${fullRows} full rows, ${leftover} left over`}
                </text>
            </g>

            {/* Trace strip: row sizes that have packed the tray exactly */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <text x={VIEW_WIDTH - 24} y={34} fill={INK_SOFT} fontSize="12" textAnchor="end">
                    Row sizes that work
                </text>
                {ROW_SIZES.map((size, position) => {
                    const isFound = foundList.includes(size);
                    const centerX = VIEW_WIDTH - 24 - (ROW_SIZES.length - 0.5 - position) * 22;
                    return (
                        <g key={size}>
                            <rect
                                x={centerX - 10}
                                y={48}
                                width={20}
                                height={20}
                                rx={5}
                                fill={isFound ? ACCENT : "#F1F5F9"}
                                stroke={isFound ? ACCENT : "#CBD5E1"}
                                strokeWidth="1.5"
                            />
                            <text
                                x={centerX}
                                y={62}
                                fontSize="11"
                                textAnchor="middle"
                                fill={isFound ? "#FFFFFF" : "#94A3B8"}
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {size}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* The packed rectangle: full rows plus its outline when nothing is left over */}
            <g
                opacity={dim("rectangle")}
                style={{ transition: "opacity 150ms ease-out" }}
                {...hoverProps("rectangle")}
            >
                {isPerfect && highlight === "rectangle" && (
                    <rect
                        x={GRID_X + 2}
                        y={GRID_Y + 2}
                        width={rowWidth * PITCH - 4}
                        height={fullRows * PITCH - 4}
                        rx={10}
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth={9}
                        opacity={0.28}
                    />
                )}
                {isPerfect && (
                    <rect
                        x={GRID_X + 2}
                        y={GRID_Y + 2}
                        width={rowWidth * PITCH - 4}
                        height={fullRows * PITCH - 4}
                        rx={10}
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth={highlight === "rectangle" ? 3.5 : 2}
                        style={{ transition: "stroke-width 150ms ease-out" }}
                    />
                )}
                {snacks
                    .filter((snack) => !snack.isLeftover)
                    .map((snack) => (
                        <rect
                            key={snack.index}
                            x={snack.x - 11}
                            y={snack.y - 11}
                            width={22}
                            height={22}
                            rx={6}
                            fill={ACCENT}
                        />
                    ))}
            </g>

            {/* Leftovers: the snacks that break the rectangle */}
            <g
                opacity={dim("leftovers")}
                style={{ transition: "opacity 150ms ease-out" }}
                {...hoverProps("leftovers")}
            >
                {snacks
                    .filter((snack) => snack.isLeftover)
                    .map((snack) => (
                        <g key={snack.index}>
                            {highlight === "leftovers" && (
                                <rect
                                    x={snack.x - 15}
                                    y={snack.y - 15}
                                    width={30}
                                    height={30}
                                    rx={9}
                                    fill="none"
                                    stroke={LEFTOVER_STROKE}
                                    strokeWidth={8}
                                    opacity={0.28}
                                />
                            )}
                            <rect
                                x={snack.x - 11}
                                y={snack.y - 11}
                                width={22}
                                height={22}
                                rx={6}
                                fill={LEFTOVER_FILL}
                                stroke={LEFTOVER_STROKE}
                                strokeWidth={highlight === "leftovers" ? 2.5 : 1.5}
                                strokeDasharray="3 3"
                                style={{ transition: "stroke-width 150ms ease-out" }}
                            />
                        </g>
                    ))}
            </g>

            {/* Draggable tray edge */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <line
                    x1={handleX - 8}
                    y1={GRID_Y}
                    x2={handleX - 8}
                    y2={GRID_Y + gridHeight}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <rect
                    x={handleX - 6}
                    y={handleY - 22}
                    width={12}
                    height={44}
                    rx={6}
                    fill={ACCENT}
                    filter="url(#snack-handle-shadow)"
                />
                <rect
                    x={handleX - 20}
                    y={handleY - 34}
                    width={40}
                    height={68}
                    fill="transparent"
                    style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setDragging(true);
                    }}
                    onPointerMove={(event) => {
                        if (dragging) setWidthFromPointer(event.clientX);
                    }}
                    onPointerUp={() => setDragging(false)}
                    onPointerCancel={() => setDragging(false)}
                />
            </g>
        </svg>
    );
}

function SnackTrayFigure() {
    const setVar = useSetVar();
    return (
        <Figure
            id="snack-tray-rectangles"
            onReset={() => {
                setVar("snackRowWidth", 5);
                setVar("snackFactorsFound", "");
                setVar("snackTrayHighlight", "");
            }}
            caption="Drag the teal edge of the tray to change the row size. Row sizes that leave nothing over get recorded along the top."
        >
            <SnackTrayDrawing />
            <InteractionHintSequence
                hintKey="snack-tray-edge-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the tray edge to change the row size",
                        position: { x: "39%", y: "47%" },
                        dragPath: { type: "line", startOffset: { x: -28, y: 0 }, endOffset: { x: 28, y: 0 } },
                    },
                ]}
            />
        </Figure>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const buildingBlocksSectionBlocks: ReactElement[] = [
    <StackLayout key="layout-building-blocks-heading" maxWidth="xl">
        <Block id="building-blocks-heading" padding="md">
            <EditableH2 id="h2-building-blocks-heading" blockId="building-blocks-heading">
                What a Number Is Made Of
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-building-blocks-setup" maxWidth="xl">
        <Block id="building-blocks-setup" padding="sm">
            <EditableParagraph id="para-building-blocks-setup" blockId="building-blocks-setup">Every whole number can be pulled apart into smaller numbers multiplied together. Here are 24 snacks on a tray, sitting <InlineScrubbleNumber varName={"snackRowWidth"} defaultValue={5} min={3} max={12} step={1} color={"#62D0AD"} id={"scrubble-1787192180439-ry36t"} /> to a row. Drag the teal edge of the tray to widen or narrow the rows, and watch whether the snacks close up into a neat rectangle or leave a few stragglers <InlineLinkedHighlight varName={"snackTrayHighlight"} highlightId={"leftovers"} color={"#F57C00"} bgColor={"rgba(247, 178, 59, 0.2)"} id={"linkedHighlight-1787192180439-glaml"}>left over</InlineLinkedHighlight>.</EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-building-blocks-visual" maxWidth="xl">
        <Block id="building-blocks-visual" padding="sm" hasVisualization>
            <SnackTrayFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-building-blocks-reflect" maxWidth="xl">
        <Block id="building-blocks-reflect" padding="sm">
            <EditableParagraph id="para-building-blocks-reflect" blockId="building-blocks-reflect">
                The row sizes that fill the tray exactly are the factors of 24. Only five of them
                hide between 3 and 12, and no amount of shuffling produces a sixth.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-building-blocks-question-naming" maxWidth="xl">
        <Block id="building-blocks-question-naming" padding="md">
            <EditableParagraph id="para-building-blocks-question-naming" blockId="building-blocks-question-naming">On a different tray, 30 snacks sit in rows of 6 with nothing left over, which makes 6 a <InlineFeedback varName={"answerRowSizeIsCalled"} correctValue={"factor"} caseSensitive={false} position={"terminal"} successMessage={"— yes, a factor divides into a number and lands exactly on it, which is what a full row does"} failureMessage={"— careful, that is the other one"} hint={"A multiple is what you reach by counting past the number, not what fits neatly inside it"} reviewBlockId={"building-blocks-visual"} reviewLabel={"Look at the tray again"}><InlineClozeChoice varName={"answerRowSizeIsCalled"} correctAnswer={"factor"} options={["factor", "multiple"]} placeholder={"???"} color={"#5E35B1"} bgColor={"rgba(59, 130, 246, 0.35)"} id={"choice-1787192180443-oompo"} /></InlineFeedback> of 30.</EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-building-blocks-question-row-size" maxWidth="xl">
        <Block id="building-blocks-question-row-size" padding="md">
            <EditableParagraph id="para-building-blocks-question-row-size" blockId="building-blocks-question-row-size">
                Back on the tray of 24, rows of 7 always leave stragglers, and so do rows of 9, 10
                and 11. The one row size between 7 and 11 that fills the tray exactly is{" "}
                <InlineFeedback
                    varName="answerRowSizeBetweenSevenAndEleven"
                    correctValue="8"
                    position="terminal"
                    successMessage="— exactly, three rows of 8 use up all 24 snacks with nothing spare"
                    failureMessage="— not that one"
                    hint="Try each row size in turn and see which one closes the rectangle"
                    visualizationHint={{
                        blockId: "building-blocks-visual",
                        hintKey: "feedback-snack-tray-row-size",
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the tray edge out to rows of 7 — count the stragglers",
                                position: { x: "39%", y: "47%" },
                                dragPath: { type: "line", startOffset: { x: -24, y: 0 }, endOffset: { x: 24, y: 0 } },
                                completionVar: "snackRowWidth",
                                completionValue: 7,
                                completionTolerance: 0,
                            },
                            {
                                gesture: "drag-horizontal",
                                label: "Keep widening, one row size at a time, until the rectangle closes",
                                position: { x: "48%", y: "47%" },
                                dragPath: { type: "line", startOffset: { x: -24, y: 0 }, endOffset: { x: 24, y: 0 } },
                                completionVar: "snackRowWidth",
                                completionValue: 8,
                                completionTolerance: 0,
                            },
                        ],
                        label: "Discover it yourself",
                        resetVars: { snackRowWidth: 5 },
                    }}
                >
                    <InlineClozeInput
                        varName="answerRowSizeBetweenSevenAndEleven"
                        correctAnswer="8"
                        {...clozePropsFromDefinition(getVariableInfo('answerRowSizeBetweenSevenAndEleven'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
