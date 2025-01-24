import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { StackParamList } from "../types";
import TrackOptions from "./helpers/TrackOptions";
import { Spacer, View, XStack, YStack } from "tamagui";
import BlurhashedImage from "../Global/helpers/blurhashed-image";
import { Text } from "../Global/helpers/text";
import { Colors } from "../../enums/colors";
import FavoriteButton from "../Global/components/favorite-button";

export default function ItemDetail({ 
    item, 
    navigation,
    isModal = false
} : { 
    item: BaseItemDto, 
    navigation: NativeStackNavigationProp<StackParamList>,
    isModal: boolean
}) : React.JSX.Element {

    let options: React.JSX.Element | undefined = undefined;

    const { width } = useSafeAreaFrame();

    switch (item.Type) {
        case "Audio": {
            options = TrackOptions({ item, navigation, isModal });
            break;
        }

        case "MusicAlbum" : {

            break;
        }

        case "MusicArtist" : {

            break;
        }

        case "Playlist" : {

            break;
        }

        default : {
            break;
        }
    }

    return (
        <SafeAreaView edges={["top", "right", "left"]}>
            <YStack alignContent="center" justifyContent="flex-start">
                <BlurhashedImage
                    item={item}
                    size={width / 2}
                />

                <YStack 
                    marginLeft={"$0.5"} 
                    justifyContent="center"
                    alignContent="space-between"
                >
                    <Text bold fontSize={"$6"}>
                        { item.Name ?? "Untitled Track" }
                    </Text>

                    <Text 
                        fontSize={"$6"} 
                        color={Colors.Primary}
                        onPress={() => {
                            if (item.ArtistItems) {

                                if (isModal)
                                    navigation.navigate("Artist", {
                                        artist: item.ArtistItems[0]
                                    })

                                else {
                                    navigation.goBack();
                                    navigation.push("Artist", {
                                        artist: item.ArtistItems[0]
                                    });
                                }
                            }
                        }}>
                        { item.Artists?.join(", ") ?? "Unknown Artist"}
                    </Text>
                        
                    <Text 
                        fontSize={"$6"} 
                        color={"$gray10"}
                    >
                        { item.Album ?? "" }
                    </Text>

                    <Spacer />

                    <FavoriteButton item={item} />
                    
                    <Spacer />
                    
                    { options ?? <View /> }
                </YStack>

            </YStack>
        </SafeAreaView>
    )
}