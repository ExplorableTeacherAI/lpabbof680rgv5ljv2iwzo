import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
            <EditableParagraph id="para-building-blocks-setup" blockId="building-blocks-setup">
                Every whole number can be pulled apart into smaller numbers multiplied together.
                Keep pulling, and eventually you reach numbers that refuse to split any further.
                Those stubborn ones are the primes, and they are the building blocks of everything
                else. Let's take 24 apart and see what it is hiding.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-building-blocks-visual" maxWidth="xl">
        <Block id="building-blocks-visual">
            <VisualOptionCards
                blockId="building-blocks-visual"
                cards={[
                    {
                        id: "splitting-tree",
                        title: "A number breaks apart into two smaller numbers, again and again",
                        looks: "Imagine the number 24 alone at the top of a clear space. Pull it apart and two smaller numbers drop below it, joined by short lines. Numbers that can still be split stay bright; ones that cannot dim and settle where they are.",
                        manipulate: "Pull each bright number apart into a pair of numbers that multiply to make it, until nothing bright is left",
                        reveals: "However you choose to break a number up, you always finish with the same set of prime blocks.",
                        paradigm: "constructivist",
                        recommended: true,
                    },
                    {
                        id: "snack-tray-rectangles",
                        title: "A tray of 24 snacks pushed into every equal row it allows",
                        looks: "Imagine 24 snacks scattered loose on a tray. Push them together and they snap into rows. Arrangements that come out as a perfect rectangle hold together and write their row size along the edge; arrangements that leave a gap fall loose again.",
                        manipulate: "Rearrange the 24 snacks into every rectangle they can make with nothing left over",
                        reveals: "The row sizes that hold together are exactly the factors of 24, and nothing else fits.",
                        targetsMisconception: "Students confuse factors with multiples",
                        paradigm: "goal",
                    },
                    {
                        id: "hop-line-factors",
                        title: "A number line where hops either land on 24 or step straight past it",
                        looks: "Imagine a long line of numbers with 24 marked in teal. A counter hops along it in equal steps, leaving a dot at every landing. Below, a second line keeps the same hops going well past 24, marking each landing there too.",
                        manipulate: "Stretch the hop size and see whether the counter lands exactly on 24 or steps over it",
                        reveals: "Factors are the hop sizes that land on a number; multiples are the places you reach by carrying on past it.",
                        targetsMisconception: "Students confuse factors with multiples",
                        paradigm: "comparison",
                        secondView: {
                            shows: "The same hop size continuing beyond 24, marking its multiples",
                            role: "constraining",
                            syncedBy: "hopSize, plus a shared hover highlight on the landing at 24",
                        },
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
