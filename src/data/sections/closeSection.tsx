import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";

export const closeSectionBlocks: ReactElement[] = [
    <StackLayout key="layout-close-heading" maxWidth="xl">
        <Block id="close-heading" padding="md">
            <EditableH2 id="h2-close-heading" blockId="close-heading">
                What You Can Now See
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-close-summary" maxWidth="xl">
        <Block id="close-summary" padding="sm">
            <EditableParagraph id="para-close-summary" blockId="close-summary">
                Both answers were sitting in the same two piles of blocks all along. Keep only the
                blocks the two numbers share and you have the largest thing that fits inside both
                of them. Keep every block, but never more copies than the greediest number needs,
                and you have the smallest thing they both fit into.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-close-forward" maxWidth="xl">
        <Block id="close-forward" padding="sm">
            <EditableParagraph id="para-close-forward" blockId="close-forward">
                One answer looks inward, the other looks outward, and the pile of blocks tells you
                both. The same move works on three numbers at once, and it is the trick behind
                adding fractions with awkward denominators.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
