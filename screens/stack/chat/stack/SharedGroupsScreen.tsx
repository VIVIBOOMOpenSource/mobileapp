import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  ChannelList,
  ChannelListMessenger,
  ChannelListMessengerProps,
  ChannelPreviewMessengerProps,
  GroupAvatar,
  getChannelPreviewDisplayAvatar,
  useChannelPreviewDisplayName,
  useChannelsContext,
  useTheme,
} from 'stream-chat-expo';

import { ScreenHeader } from '../components/ScreenHeader';
import { useChatContext } from '../context/ChatContext';
import { Contacts } from '../icons/Contacts';
import type { ChatRootStackScreenProps, StreamChatGenerics } from '../types';

type CustomPreviewProps = ChannelPreviewMessengerProps<StreamChatGenerics>;

const CustomPreview: React.FC<CustomPreviewProps> = ({ channel }) => {
  const { chatClient } = useChatContext();
  const name = useChannelPreviewDisplayName(channel, 30);
  const navigation = useNavigation();
  const {
    theme: {
      colors: { black, grey, grey_whisper, white_snow },
    },
  } = useTheme();

  if (!chatClient) return null;

  if (Object.keys(channel.state.members).length === 2) return null;

  const displayAvatar = getChannelPreviewDisplayAvatar(channel, chatClient);

  const switchToChannel = () => {
    navigation.push('ChannelScreen', { channelId: channel.id });
  };

  return (
    <TouchableOpacity
      onPress={switchToChannel}
      style={[
        styles.previewContainer,
        {
          backgroundColor: white_snow,
          borderBottomColor: grey_whisper,
        },
      ]}
    >
      <View style={styles.groupContainer}>
        {displayAvatar.images ? (
          <GroupAvatar channelId={channel.id} ids={displayAvatar.ids} images={displayAvatar.images} names={displayAvatar.names} size={40} />
        ) : (
          <Avatar channelId={channel.id} id={displayAvatar.id} image={displayAvatar.image} name={displayAvatar.name} size={40} />
        )}
        <Text style={[styles.nameText, { color: black }]}>{name}</Text>
      </View>
      <Text
        style={{
          color: grey,
        }}
      >
        {Object.keys(channel.state.members).length} Members
      </Text>
    </TouchableOpacity>
  );
};

const EmptyListComponent = () => {
  const {
    theme: {
      colors: { black, grey, grey_gainsboro },
    },
  } = useTheme();

  return (
    <View style={styles.emptyListContainer}>
      <Contacts fill={grey_gainsboro} scale={6} />
      <Text style={[styles.emptyListTitle, { color: black }]}>No shared groups</Text>
      <Text style={[styles.emptyListSubtitle, { color: grey }]}>Groups shared with user will appear here</Text>
    </View>
  );
};

type ListComponentProps = ChannelListMessengerProps<StreamChatGenerics>;

// If the length of channels is 1, which means we only got 1:1-distinct channel,
// And we don't want to show 1:1-distinct channel in this list.
const ListComponent: React.FC<ListComponentProps> = (props) => {
  const { channels, loadingChannels, refreshing } = useChannelsContext();

  if (channels?.length <= 1 && !loadingChannels && !refreshing) {
    return <EmptyListComponent />;
  }

  return <ChannelListMessenger {...props} />;
};

export default function SharedGroupsScreen({
  route: {
    params: { user },
  },
}: ChatRootStackScreenProps<'SharedGroupsScreen'>) {
  const { chatClient } = useChatContext();

  if (!chatClient?.user) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader titleText="Shared Groups" />
      <ChannelList
        filters={{
          $and: [{ members: { $in: [chatClient?.user?.id] } }, { members: { $in: [user.id] } }],
        }}
        List={ListComponent}
        options={{
          watch: false,
        }}
        Preview={CustomPreview}
        sort={{
          last_message_at: -1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyListContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyListSubtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  emptyListTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  groupContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameText: {
    fontWeight: '700',
    marginLeft: 8,
  },
  previewContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
});
