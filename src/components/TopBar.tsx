import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { IconCircle } from "./IconCircle";

export function TopBar({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  leftChevron,
  onLeftPress
}: {
  title: string;
  subtitle?: string;
  rightIcon?: string;
  onRightPress?: () => void;
  leftChevron?: boolean;
  onLeftPress?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.left}>
          {leftChevron ? (
            <Pressable
              onPress={onLeftPress}
              accessibilityRole="button"
              style={styles.chevHit}
            >
              <Text style={styles.chev}>‹</Text>
            </Pressable>
          ) : (
            <View style={styles.chevSpacer} />
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>

        {rightIcon ? (
          <Pressable onPress={onRightPress} accessibilityRole="button">
            <IconCircle label={rightIcon} />
          </Pressable>
        ) : (
          <View style={{ width: 28 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: colors.bg
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.caption, color: colors.subtext, marginTop: 2 },
  chev: { fontSize: 24, color: colors.subtext, fontWeight: "800" },
  chevHit: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  chevSpacer: { width: 32, height: 32 }
});

