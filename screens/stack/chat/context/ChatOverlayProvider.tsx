import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { OverlayBackdrop } from 'stream-chat-expo';

import { BottomSheetOverlay } from '../components/BottomSheetOverlay';
import { ChannelInfoOverlay } from '../components/ChannelInfoOverlay';
import { UserInfoOverlay } from '../components/UserInfoOverlay';
import { BottomSheetOverlayProvider } from './BottomSheetOverlayContext';
import { ChannelInfoOverlayProvider } from './ChannelInfoOverlayContext';
import { ChatOverlayContext, ChatOverlayContextValue } from './ChatOverlayContext';
import { UserInfoOverlayProvider } from './UserInfoOverlayContext';

// eslint-disable-next-line import/prefer-default-export
export const ChatOverlayProvider = (
  props: React.PropsWithChildren<{
    value?: Partial<ChatOverlayContextValue>;
  }>,
) => {
  const { children, value } = props;

  const [overlay, setOverlay] = useState(value?.overlay || 'none');

  const overlayOpacity = useSharedValue(0);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const backAction = () => {
      if (overlay !== 'none') {
        setOverlay('none');
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [overlay]);

  useEffect(() => {
    cancelAnimation(overlayOpacity);
    if (overlay !== 'none') {
      overlayOpacity.value = withTiming(1);
    } else {
      overlayOpacity.value = withTiming(0);
    }
  }, [overlay]);

  const overlayStyle = useAnimatedStyle<ViewStyle>(
    () => ({
      opacity: overlayOpacity.value,
    }),
    [],
  );

  const overlayContext = {
    overlay,
    setOverlay,
  };

  return (
    <ChatOverlayContext.Provider value={overlayContext}>
      <BottomSheetOverlayProvider>
        <ChannelInfoOverlayProvider>
          <UserInfoOverlayProvider>
            {children}
            <Animated.View pointerEvents={overlay === 'none' ? 'none' : 'auto'} style={[StyleSheet.absoluteFill, overlayStyle]}>
              <OverlayBackdrop style={[StyleSheet.absoluteFill, { height, width }]} />
            </Animated.View>
            <UserInfoOverlay overlayOpacity={overlayOpacity} visible={overlay === 'userInfo'} />
            <ChannelInfoOverlay overlayOpacity={overlayOpacity} visible={overlay === 'channelInfo'} />
            <BottomSheetOverlay overlayOpacity={overlayOpacity} visible={overlay === 'addMembers' || overlay === 'confirmation'} />
          </UserInfoOverlayProvider>
        </ChannelInfoOverlayProvider>
      </BottomSheetOverlayProvider>
    </ChatOverlayContext.Provider>
  );
};
