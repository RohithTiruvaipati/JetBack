import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;

  return (
    <View style={styles.webOuter}>
      <View style={styles.webShadow}>
        <View style={styles.webInner}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    minHeight: "100vh" as any,
    width: "100%" as any,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F7",
    paddingVertical: 24
  },
  webShadow: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    borderRadius: 28,
    backgroundColor: "#00000010",
    padding: 10
  },
  webInner: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FFFFFF"
  }
});

