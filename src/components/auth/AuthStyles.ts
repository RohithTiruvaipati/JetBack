import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export const authStyles = StyleSheet.create({
  label: { ...typography.caption, color: colors.subtext, marginBottom: 6 },
  input: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.grayPill,
    paddingHorizontal: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputRow: { flexDirection: "row", gap: 10 },
  field: { marginBottom: 12 },
  primaryButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700" as const },
  ghostButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButtonText: { color: colors.orange, fontWeight: "700" as const },
  link: { color: colors.orange, fontWeight: "700" as const },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 12 },
  divider: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { ...typography.caption, color: colors.subtext },
  socialButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  socialButtonText: { color: colors.text, fontWeight: "700" as const },
  errorText: { ...typography.caption, color: "#B91C1C", marginTop: 8 },
  helperText: { ...typography.caption, color: colors.subtext, marginTop: 8 },
});

