import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                The other question runs the opposite way. Instead of the biggest number hiding
                inside both, we want the smallest number that both of them fit into. Multiplying
                24 by 36 certainly works, but it overshoots badly, because the blocks they share
                end up counted twice.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-visual" maxWidth="xl">
        <Block id="lowest-common-multiple-visual">
            <VisualOptionCards
                blockId="lowest-common-multiple-visual"
                cards={[
                    {
                        id: "smallest-tower-build",
                        title: "One tower being built that both numbers have to fit inside",
                        looks: "Imagine the blocks of 24 and the blocks of 36 laid out at the sides, and an empty tower in the middle. Every block dropped into the tower changes its total. Each side lights up green the moment the tower can be shared out evenly into that number, and drops back to grey if a block is pulled out.",
                        manipulate: "Add and remove blocks from the middle tower until both sides are green at the smallest total they can manage",
                        reveals: "You need each block only as many times as the greediest number asks for, never twice over.",
                        paradigm: "constructivist",
                        recommended: true,
                    },
                    {
                        id: "two-refill-timers",
                        title: "Two snack machines refilling on different timers along one clock",
                        looks: "Imagine two lanes running left to right along a shared clock. The top machine drops a mark every 24 minutes, the bottom one every 36 minutes. As the clock is wound forward each lane leaves its marks behind, so the gaps between them are easy to compare.",
                        manipulate: "Wind the clock forward until a mark from both lanes lands on the same moment",
                        reveals: "The first moment both marks meet is the lowest common multiple, long before the two times multiplied together.",
                        targetsMisconception: "Students think the LCM is always the two numbers multiplied together",
                        paradigm: "temporal",
                    },
                    {
                        id: "guess-the-meeting-point",
                        title: "A long line with 24 and 36 stepping along it toward a guessed meeting point",
                        looks: "Imagine a long line stretching far to the right, with a flag students can place anywhere on it. Behind the flag, two rows of steps set out from zero, one in jumps of 24 and one in jumps of 36, and they carry on until they either land together or run past the flag.",
                        manipulate: "Plant the flag where they think the two step patterns first meet, then release the steps to see where they actually do",
                        reveals: "The meeting point is far nearer than 24 times 36, because the two patterns share most of their build.",
                        targetsMisconception: "Students think the LCM is always the two numbers multiplied together",
                        paradigm: "prediction",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
