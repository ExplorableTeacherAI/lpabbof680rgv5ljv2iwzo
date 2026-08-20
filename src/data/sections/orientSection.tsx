import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableParagraph } from "@/components/atoms";

export const orientSectionBlocks: ReactElement[] = [
    <StackLayout key="layout-orient-title" maxWidth="xl">
        <Block id="orient-title" padding="md">
            <EditableH1 id="h1-orient-title" blockId="orient-title">
                Sharing Without Leftovers
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-orient-opening" maxWidth="xl">
        <Block id="orient-opening" padding="sm">
            <EditableParagraph id="para-orient-opening" blockId="orient-opening">
                Take any two numbers, say 24 and 36. There is a biggest number that divides
                neatly into both of them, and there is a smallest number that both of them
                divide neatly into. Those two answers have names: the highest common factor
                and the lowest common multiple.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-orient-promise" maxWidth="xl">
        <Block id="orient-promise" padding="sm">
            <EditableParagraph id="para-orient-promise" blockId="orient-promise">
                By the end you will be able to find both of them for any pair of numbers, using
                nothing but the pieces those numbers are built from. You do not need to know what
                a prime is to start. We begin by pulling a number apart and seeing what falls out.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
