import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                This is where most marks quietly disappear, because both questions sound alike.
                Splitting things into equal groups asks what divides into both numbers, so the
                answer comes out smaller than either of them. Things repeating until they meet
                again asks what both numbers divide into, so the answer comes out bigger.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-which-one-visual" maxWidth="xl">
        <Block id="which-one-visual">
            <VisualOptionCards
                blockId="which-one-visual"
                cards={[
                    {
                        id: "sort-the-scenarios",
                        title: "Snack pack scenarios dropped into one of two trays before being solved",
                        looks: "Imagine a short story card sitting between two open trays, one for splitting into groups and one for repeating until things meet. Once a card lands in a tray the scene it describes plays out underneath, and the answer slides into place on a line showing where the two starting numbers sit.",
                        manipulate: "Drop each scenario card into the tray they think it belongs in, then watch the scene play out",
                        reveals: "Grouping questions always give an answer below both numbers; repeating questions always give one above them.",
                        targetsMisconception: "Students mix up HCF and LCM, or guess which one a question needs",
                        paradigm: "prediction",
                        recommended: true,
                    },
                    {
                        id: "one-story-two-endings",
                        title: "One snack stall scene that switches between sharing out and refilling",
                        looks: "Imagine a stall with 18 juices and 30 crisps on the counter. A switch flips the scene between two versions of itself: in one the stock is shared into identical trays, in the other the two items are restocked on their own repeating timers until a delivery brings both at once. The numbers on the counter stay the same in both.",
                        manipulate: "Flip between the two versions of the same stall and compare where each answer lands",
                        reveals: "The same pair of numbers gives two very different answers, depending on whether things are being split or repeated.",
                        targetsMisconception: "Students mix up HCF and LCM, or guess which one a question needs",
                        paradigm: "comparison",
                    },
                    {
                        id: "build-a-question",
                        title: "An answer of 12 with an empty snack pack story waiting to be filled in",
                        looks: "Imagine the number 12 fixed at the top of the screen and, below it, a half-written stall story with gaps for the two starting amounts and for what happens to them. As the gaps are filled the story acts itself out, and the result it produces appears next to the 12 for comparison.",
                        manipulate: "Fill in the amounts and the situation so that the story really does end with an answer of 12",
                        reveals: "Working backwards forces you to notice which situations shrink the numbers and which ones grow them.",
                        paradigm: "inversion",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
