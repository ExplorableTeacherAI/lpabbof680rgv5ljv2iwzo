import { useEffect, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
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
    numberPropsFromDefinition,
    clozePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";

// ── Party bag figure ─────────────────────────────────────────────────────────

const CHOCOLATES = 24;
const SWEETS = 36;
const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 300;
const BAG_PITCH = 36;
const BAG_WIDTH = 30;
const BAG_TOP = 100;
const BAG_HEIGHT = 86;
const MIN_BAGS = 3;
const MAX_BAGS = 12;
const CHOCOLATE = "#62D0AD";
const SWEET = "#8E90F5";
const INK = "#334155";
const INK_SOFT = "#64748B";
const LEFTOVER_STROKE = "#94A3B8";

function PartyBagDrawing() {
    const setVar = useSetVar();
    const bagCount = clamp(Math.round(useVar<number>("partyBagCount", 5)), MIN_BAGS, MAX_BAGS);
    const highlight = useVar<string>("partyBagHighlight", "");
    const bestClean = useVar<number>("partyBagBestClean", 0);

    const chocolatesPerBag = Math.floor(CHOCOLATES / bagCount);
    const sweetsPerBag = Math.floor(SWEETS / bagCount);
    const chocolatesLeft = CHOCOLATES % bagCount;
    const sweetsLeft = SWEETS % bagCount;
    const isClean = chocolatesLeft === 0 && sweetsLeft === 0;

    // Trace: the best clean pack found so far stays on screen.
    useEffect(() => {
        if (isClean && bagCount > bestClean) setVar("partyBagBestClean", bagCount);
    }, [isClean, bagCount, bestClean, setVar]);

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("partyBagHighlight", id),
        onPointerLeave: () => setVar("partyBagHighlight", ""),
    });

    const rowWidth = bagCount * BAG_PITCH - (BAG_PITCH - BAG_WIDTH);
    const startX = (VIEW_WIDTH - rowWidth) / 2;
    const lastBagRight = startX + (bagCount - 1) * BAG_PITCH + BAG_WIDTH;
    const bagCenterY = BAG_TOP + BAG_HEIGHT / 2;

    const leftovers = [
        ...Array.from({ length: chocolatesLeft }, () => CHOCOLATE),
        ...Array.from({ length: sweetsLeft }, () => SWEET),
    ];

    const ghostSlot = (x: number, symbol: string, enabled: boolean, nextCount: number, key: string) => (
        <g
            key={key}
            opacity={enabled ? 1 : 0.3}
            style={{ cursor: enabled ? "pointer" : "default" }}
            onClick={() => {
                if (enabled) setVar("partyBagCount", nextCount);
            }}
        >
            <rect
                x={x}
                y={BAG_TOP}
                width={BAG_WIDTH}
                height={BAG_HEIGHT}
                rx={8}
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
            />
            <text x={x + BAG_WIDTH / 2} y={bagCenterY + 7} fontSize="20" textAnchor="middle" fill={INK_SOFT}>
                {symbol}
            </text>
        </g>
    );

    return (
        <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="block w-full" style={{ touchAction: "none" }}>
            {/* Readouts */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                <text x={24} y={30} fill={INK_SOFT} fontSize="12">
                    24 chocolates and 36 sweets
                </text>
                <text x={VIEW_WIDTH - 24} y={30} fill={INK_SOFT} fontSize="12" textAnchor="end">
                    {bestClean > 0 ? `Best clean pack so far: ${bestClean} bags` : "No clean pack found yet"}
                </text>
                <text x={24} y={60} fill={INK} fontSize="15" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {`${bagCount} bags, each holding ${chocolatesPerBag} chocolates and ${sweetsPerBag} sweets`}
                </text>
            </g>

            {/* The identical bags */}
            <g opacity={dim("bags")} style={{ transition: "opacity 150ms ease-out" }} {...hoverProps("bags")}>
                {Array.from({ length: bagCount }, (_, index) => {
                    const x = startX + index * BAG_PITCH;
                    return (
                        <g key={index}>
                            {isClean && highlight === "bags" && (
                                <rect
                                    x={x - 2}
                                    y={BAG_TOP - 2}
                                    width={BAG_WIDTH + 4}
                                    height={BAG_HEIGHT + 4}
                                    rx={10}
                                    fill="none"
                                    stroke={CHOCOLATE}
                                    strokeWidth={8}
                                    opacity={0.28}
                                />
                            )}
                            <rect
                                x={x}
                                y={BAG_TOP}
                                width={BAG_WIDTH}
                                height={BAG_HEIGHT}
                                rx={8}
                                fill="#FFFFFF"
                                stroke={isClean ? CHOCOLATE : "#CBD5E1"}
                                strokeWidth={isClean ? (highlight === "bags" ? 3.5 : 2) : 1.5}
                                style={{ transition: "stroke-width 150ms ease-out" }}
                            />
                            <rect x={x + 3} y={BAG_TOP + 12} width={BAG_WIDTH - 6} height={26} rx={6} fill={CHOCOLATE} />
                            <text
                                x={x + BAG_WIDTH / 2}
                                y={BAG_TOP + 30}
                                fontSize="12"
                                textAnchor="middle"
                                fill="#FFFFFF"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {chocolatesPerBag}
                            </text>
                            <rect x={x + 3} y={BAG_TOP + 46} width={BAG_WIDTH - 6} height={26} rx={6} fill={SWEET} />
                            <text
                                x={x + BAG_WIDTH / 2}
                                y={BAG_TOP + 64}
                                fontSize="12"
                                textAnchor="middle"
                                fill="#FFFFFF"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {sweetsPerBag}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* Add and remove slots */}
            <g opacity={highlight ? 0.45 : 1} style={{ transition: "opacity 150ms ease-out" }}>
                {ghostSlot(startX - BAG_PITCH, "−", bagCount > MIN_BAGS, bagCount - 1, "remove-bag")}
                {ghostSlot(lastBagRight + 6, "+", bagCount < MAX_BAGS, bagCount + 1, "add-bag")}
            </g>

            {/* What will not divide up, left on the table */}
            <g opacity={dim("leftovers")} style={{ transition: "opacity 150ms ease-out" }} {...hoverProps("leftovers")}>
                <text x={24} y={228} fill={isClean ? CHOCOLATE : LEFTOVER_STROKE} fontSize="12">
                    {isClean
                        ? "Nothing left on the table"
                        : `Left on the table: ${chocolatesLeft} chocolates, ${sweetsLeft} sweets`}
                </text>
                {leftovers.map((hue, index) => {
                    const cx = 40 + index * 18;
                    return (
                        <g key={index}>
                            {highlight === "leftovers" && (
                                <circle cx={cx} cy={254} r={11} fill="none" stroke={hue} strokeWidth={7} opacity={0.28} />
                            )}
                            <circle
                                cx={cx}
                                cy={254}
                                r={7}
                                fill="#F1F5F9"
                                stroke={hue}
                                strokeWidth={highlight === "leftovers" ? 2.5 : 1.5}
                                strokeDasharray="3 3"
                                style={{ transition: "stroke-width 150ms ease-out" }}
                            />
                        </g>
                    );
                })}
                <line x1={30} y1={272} x2={530} y2={272} stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            </g>
        </svg>
    );
}

function PartyBagFigure() {
    const setVar = useSetVar();
    return (
        <Figure
            id="party-bag-packing"
            onReset={() => {
                setVar("partyBagCount", 5);
                setVar("partyBagBestClean", 0);
                setVar("partyBagHighlight", "");
            }}
            caption="Click the dashed slots to add or remove bags. The chocolates and sweets re-deal themselves, and whatever will not divide up waits on the table."
        >
            <PartyBagDrawing />
            <InteractionHintSequence
                hintKey="party-bag-add-slot"
                steps={[
                    {
                        gesture: "click",
                        label: "Click the dashed slot to add another bag",
                        position: { x: "69%", y: "48%" },
                    },
                ]}
            />
        </Figure>
    );
}

// ── Blocks ───────────────────────────────────────────────────────────────────

export const highestCommonFactorSectionBlocks: ReactElement[] = [
    <StackLayout key="layout-highest-common-factor-heading" maxWidth="xl">
        <Block id="highest-common-factor-heading" padding="md">
            <EditableH2 id="h2-highest-common-factor-heading" blockId="highest-common-factor-heading">
                The Biggest Pack They Can Both Fill
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-setup" maxWidth="xl">
        <Block id="highest-common-factor-setup" padding="sm">
            <EditableParagraph id="para-highest-common-factor-setup" blockId="highest-common-factor-setup">
                Twenty-four chocolates and thirty-six sweets have to go into identical party bags,
                with nothing wasted. Right now there are{" "}
                <InlineScrubbleNumber
                    varName="partyBagCount"
                    {...numberPropsFromDefinition(getVariableInfo('partyBagCount'))}
                />{" "}
                bags, and that is not going well. Click the dashed slots on either side to add and
                remove bags, and watch what gets{" "}
                <InlineLinkedHighlight
                    varName="partyBagHighlight"
                    highlightId="leftovers"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('partyBagHighlight'))}
                >
                    left on the table
                </InlineLinkedHighlight>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-visual" maxWidth="xl">
        <Block id="highest-common-factor-visual" padding="sm" hasVisualization>
            <PartyBagFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-reflect" maxWidth="xl">
        <Block id="highest-common-factor-reflect" padding="sm">
            <EditableParagraph id="para-highest-common-factor-reflect" blockId="highest-common-factor-reflect">
                More than one bag count clears the table, which is exactly where marks get lost.
                The highest common factor is the largest of them, the biggest row size that would
                pack both trays cleanly.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-question-transfer" maxWidth="xl">
        <Block id="highest-common-factor-question-transfer" padding="md">
            <EditableParagraph id="para-highest-common-factor-question-transfer" blockId="highest-common-factor-question-transfer">
                A different party has 18 balloons and 30 badges to share out. The most identical
                bags that can be filled with nothing left on the table is{" "}
                <InlineFeedback
                    varName="answerBagsEighteenAndThirty"
                    correctValue="6"
                    position="terminal"
                    successMessage="— spot on, 6 bags of 3 balloons and 5 badges uses up every single one"
                    failureMessage="— not quite"
                    hint="Find the numbers that divide into 18 and into 30, then take the biggest one"
                    reviewBlockId="highest-common-factor-visual"
                    reviewLabel="Back to the bags"
                >
                    <InlineClozeInput
                        varName="answerBagsEighteenAndThirty"
                        correctAnswer="6"
                        {...clozePropsFromDefinition(getVariableInfo('answerBagsEighteenAndThirty'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-question-bigger-pack" maxWidth="xl">
        <Block id="highest-common-factor-question-bigger-pack" padding="md">
            <EditableParagraph id="para-highest-common-factor-question-bigger-pack" blockId="highest-common-factor-question-bigger-pack">
                Someone packing 20 pens and 30 rulers stops at 5 bags and calls that the answer.
                They have stopped too early, because there is a bigger clean pack, at{" "}
                <InlineFeedback
                    varName="answerBiggerCleanPack"
                    correctValue="10"
                    position="terminal"
                    successMessage="bags — yes, 10 bags of 2 pens and 3 rulers, and nothing bigger will work"
                    failureMessage="bags — keep going, there is room above 5"
                    hint="Ask what else divides into both 20 and 30, and keep climbing until nothing does"
                    visualizationHint={{
                        blockId: "highest-common-factor-visual",
                        hintKey: "feedback-party-bag-climb",
                        steps: [
                            {
                                gesture: "click",
                                label: "Add bags until 6 clears the table — a clean pack, but keep going",
                                position: { x: "70%", y: "48%" },
                                completionVar: "partyBagCount",
                                completionValue: 6,
                                completionTolerance: 0,
                            },
                            {
                                gesture: "click",
                                label: "Keep adding — the table only clears again at the very last one",
                                position: { x: "88%", y: "48%" },
                                completionVar: "partyBagCount",
                                completionValue: 12,
                                completionTolerance: 0,
                            },
                        ],
                        label: "Discover it yourself",
                        resetVars: { partyBagCount: 5, partyBagBestClean: 0 },
                    }}
                >
                    <InlineClozeInput
                        varName="answerBiggerCleanPack"
                        correctAnswer="10"
                        {...clozePropsFromDefinition(getVariableInfo('answerBiggerCleanPack'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
