import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spinner, useTheme } from 'stream-chat-expo';

const styles = StyleSheet.create({
  networkDownContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  networkDownText: {
    marginLeft: 10,
  },
  networkDownTextLarge: {
    fontSize: 16,
    fontWeight: '700',
  },
});

// eslint-disable-next-line import/prefer-default-export
export const NetworkDownIndicator: React.FC<{ titleSize: 'small' | 'large' }> = ({
  titleSize = 'small',
}) => {
  const {
    theme: {
      colors: { black },
    },
  } = useTheme();

  return (
    <View style={styles.networkDownContainer} testID='network-down-indicator'>
      <Spinner />
      <Text
        style={[
          styles.networkDownText,
          {
            color: black,
          },
          titleSize === 'large' ? styles.networkDownTextLarge : {},
        ]}
      >
        Searching for Network
      </Text>
    </View>
  );
};
