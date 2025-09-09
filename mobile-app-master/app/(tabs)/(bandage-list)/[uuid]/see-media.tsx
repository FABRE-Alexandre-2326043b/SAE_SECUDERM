import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import ReturnButton from "@/components/ReturnButton";
import MediaItem from "@/components/MediaItem";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchFilesByTreatmentPlaceId} from "@/store/fileThunks";
import {resetDeleteStatus, resetFetchStatus, selectDeleteStatus, selectFetchStatus, selectFiles} from "@/store/file";
import i18n from "@/languages/language-config";

const { width, height } = Dimensions.get("window");

export default function MediaListScreen() {
  const { uuid } = useLocalSearchParams();
  const [mediaList, setMediaList] = useState<{ type: "image" | "video"; label: string; uri: string, id: string}[]>([]);

  const colorScheme = useColorScheme();
  const styles = colorScheme === "dark" ? darkStyles : lightStyles;

  const dispatch = useAppDispatch();

  const files = useAppSelector(selectFiles);
  const fetchFilesStatus = useAppSelector(selectFetchStatus);
  const deleteStatus = useAppSelector(selectDeleteStatus);

  // Exemple de données simulées pour tests
  useEffect(() => {
    dispatch(fetchFilesByTreatmentPlaceId(uuid as string));
  }, [uuid]);

  useEffect(() => {
    if (fetchFilesStatus === "succeeded" && files || deleteStatus === "succeeded" && files) {
      const mediaData: { type: "image" | "video"; label: string; uri: string, id: string}[] = files.map((file) => {
        return {
          type: file.mime_type.startsWith("video") ? "video" : "image",
          label: file.original_name,
          uri: file.file_url,
          id: file.id,
        };
      });
      setMediaList(mediaData);
      dispatch(resetFetchStatus()); // reset fetch status for files
      dispatch(resetDeleteStatus());
    }
  }, [fetchFilesStatus, files, deleteStatus]);

  const renderItem = ({ item }: { item: { type: "image" | "video"; label: string; uri: string , id : string} }) => (
    <MediaItem label={item.label} type={item.type} uri={item.uri} id={item.id}/>
  );

  return (
    <View style={styles.container}>
      <ReturnButton />
      <ThemedText style={styles.title}>{i18n.t("seeMedia.title")}</ThemedText>

      {mediaList.length === 0 ? (
        <ThemedText style={styles.noMediaMessage}>
          {i18n.t("seeMedia.noMedia")}
        </ThemedText>
      ) : (
        <FlatList
          data={mediaList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={styles.mediaList}
        />
      )}
    </View>
  );
}

const sharedStyles = {
  container: {
    flex: 1,
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: 24,
    marginBottom: height * 0.03,
    textAlign: "center" as "center",
  },
  noMediaMessage: {
    fontSize: 18,
    textAlign: "center" as "center",
    marginTop: height * 0.2,
  },
  mediaList: {
    paddingBottom: height * 0.1,
  },
  mediaItem: {
    marginBottom: height * 0.03,
    alignItems: "center" as "center",
  },
  mediaPreview: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 10,
  },
  videoPreview: {
    width: width * 0.8,
    height: height * 0.25,
  },
  mediaLabel: {
    marginTop: height * 0.01,
    fontSize: 18,
  },
};

const lightStyles = StyleSheet.create({
  ...sharedStyles,
  mediaLabel: {
    ...sharedStyles.mediaLabel,
    color: Colors.light.text,
  },
});

const darkStyles = StyleSheet.create({
  ...sharedStyles,
  mediaLabel: {
    ...sharedStyles.mediaLabel,
    color: Colors.dark.text,
  },
});
