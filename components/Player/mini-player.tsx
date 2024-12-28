import React from "react";
import { Text, XStack, YStack } from "tamagui";
import { useActiveTrack } from "react-native-track-player";
import { JellifyTrack } from "../../types/JellifyTrack";
import { usePlayerContext } from "../../player/provider";
import { BottomTabNavigationEventMap, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { BlurView } from "@react-native-community/blur";

export function Miniplayer({ navigation }: { navigation : NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> }) : React.JSX.Element {

    const activeTrack = useActiveTrack() as JellifyTrack | undefined;

    const { setShowPlayer } = usePlayerContext();

    return (
        <BlurView>
            <XStack height={"$20"} onPress={() => navigation.navigate("Player")}>
                <YStack>
                    <Text>{activeTrack?.title ?? "Nothing Playing"}</Text>
                </YStack>
            </XStack>
        </BlurView>
    )
}