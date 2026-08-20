import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                Now pull two numbers apart at once, 24 and 36. Some of their blocks match.
                Only those shared blocks can divide into both numbers, so multiplying the shared
                ones together gives the biggest number that goes into both. Smaller answers work
                too, but they leave shared blocks sitting unused.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-visual" maxWidth="xl">
        <Block id="highest-common-factor-visual">
            <VisualOptionCards
                blockId="highest-common-factor-visual"
                cards={[
                    {
                        id: "shared-block-shelf",
                        title: "Two stacks of prime blocks with a shared shelf between them",
                        looks: "Imagine the blocks of 24 stacked on the left and the blocks of 36 on the right, with an empty shelf running between them. A block dragged onto the shelf only stays if the other stack has a matching one to give up; unmatched blocks slide back. The shelf keeps a running total of what sits on it.",
                        manipulate: "Move every block that appears in both stacks onto the shared shelf, and watch the shelf total climb",
                        reveals: "The shared blocks multiply to the highest common factor, and there is nothing left to add.",
                        paradigm: "constructivist",
                        recommended: true,
                    },
                    {
                        id: "party-bag-packing",
                        title: "24 chocolates and 36 sweets dealt out into identical party bags",
                        looks: "Imagine a row of open party bags with two piles above them, 24 chocolates and 36 sweets. Adding or removing a bag re-deals both piles evenly across them. Anything that will not divide up stays behind on the table as leftovers.",
                        manipulate: "Add and remove bags to find the most bags they can make with nothing left on the table",
                        reveals: "The largest number of identical bags is the highest common factor of 24 and 36.",
                        targetsMisconception: "Students pick a common factor that is not the highest one",
                        paradigm: "goal",
                    },
                    {
                        id: "commit-then-check",
                        title: "A dial of possible answers with both numbers splitting behind it",
                        looks: "Imagine a dial of whole numbers with 24 and 36 shown as two long strips beneath it. Turning the dial cuts each strip into pieces of that size, and any part that does not fit a whole piece is left hanging off the end in grey.",
                        manipulate: "Commit to the number they think is the biggest that divides both, then watch the two strips cut themselves to that size",
                        reveals: "Several numbers cut both strips cleanly, but only one does it with the fewest, largest pieces.",
                        targetsMisconception: "Students pick a common factor that is not the highest one",
                        paradigm: "prediction",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
