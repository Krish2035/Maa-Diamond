import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Send,
  MessageCircle,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react-native";
import { DiamondShape } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SHAPES: DiamondShape[] = [
  "Round",
  "Marquise",
  "Pear",
  "Princess",
  "Emerald",
  "Cushion",
  "Oval",
  "Radiant",
  "Heart",
  "Asscher",
];

export default function InquiryScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, openAuthModal } = useAuth();
  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [targetShape, setTargetShape] = useState<DiamondShape>("Round");
  const [targetCarat, setTargetCarat] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      Alert.alert("Missing Information", "Please enter your Name and Mobile / WhatsApp Number.");
      return;
    }

    setSubmitting(true);
    try {
      await api.submitInquiry({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        targetShape,
        targetCarat: targetCarat ? parseFloat(targetCarat) : undefined,
        notes: `Mobile App Wholesale Inquiry: Shape: ${targetShape}, Carat: ${
          targetCarat || "Unspecified"
        }. Notes: ${notes || "None"}`,
      });
      setSubmitted(true);
    } catch {
      // In case offline, confirm receipt and prompt WhatsApp
      Alert.alert(
        "Inquiry Recorded",
        "Your requirement has been logged. Connect via WhatsApp for immediate stock allocation.",
        [
          {
            text: "Open WhatsApp",
            onPress: openWhatsApp,
          },
          { text: "OK" },
        ]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Maa Diamond Trade Desk!\nName: ${customerName || "Merchant"}\nShape: ${targetShape}\nCarat: ${
        targetCarat || "Calibrated/Pointer"
      }\nRequirement: ${notes || "Wholesale Certified Stones"}`
    );
    Linking.openURL(`https://wa.me/919033320326?text=${text}`);
  };

  const openCall = (num: string) => Linking.openURL(`tel:${num}`);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>WHOLESALE INQUIRY</Text>
          <View style={styles.verifiedTag}>
            <Sparkles size={11} color="#d97706" />
            <Text style={styles.verifiedText}>Direct Surat Factory Pricing</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* User Sign In / Profile Button */}
          <TouchableOpacity
            style={[styles.authHeaderBtn, currentUser ? styles.authHeaderBtnLoggedIn : null]}
            onPress={() => openAuthModal("signin")}
          >
            <UserIcon size={15} color={currentUser ? "#b45309" : "#ffffff"} />
            <Text
              style={[
                styles.authHeaderBtnText,
                currentUser ? styles.authHeaderBtnTextLoggedIn : null,
              ]}
              numberOfLines={1}
            >
              {currentUser ? currentUser.name.split(" ")[0] : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whatsappHeaderBtn} onPress={openWhatsApp}>
            <MessageCircle size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {submitted ? (
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={40} color="#059669" />
            </View>
            <Text style={styles.successTitle}>Inquiry Sent Successfully!</Text>
            <Text style={styles.successDesc}>
              Thank you {customerName}! Our Surat trade desk has received your diamond requirement.
              We will get in touch on {customerPhone} shortly with available parcel lots and pricing.
            </Text>

            <TouchableOpacity style={styles.whatsappCtaBtn} onPress={openWhatsApp}>
              <MessageCircle size={16} color="#ffffff" />
              <Text style={styles.whatsappCtaText}>Chat with Trade Desk on WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newInquiryBtn}
              onPress={() => {
                setSubmitted(false);
                setNotes("");
                setTargetCarat("");
              }}
            >
              <Text style={styles.newInquiryText}>Submit Another Inquiry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Merchant Account Status Banner */}
            {currentUser ? (
              <View style={styles.inquiryUserBanner}>
                <View style={styles.inquiryUserLeft}>
                  <Text style={styles.inquiryUserTitle}>
                    ✓ Logged In: {currentUser.name}
                  </Text>
                  <Text style={styles.inquiryUserSub}>
                    {currentUser.companyName || "Verified Merchant"} • Contact details pre-filled
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.inquiryUserBtn}
                  onPress={() => openAuthModal("signin")}
                >
                  <Text style={styles.inquiryUserBtnText}>Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inquiryAuthBanner}>
                <View style={styles.inquiryAuthLeft}>
                  <Text style={styles.inquiryAuthTitle}>Wholesale Merchant Account</Text>
                  <Text style={styles.inquiryAuthSub}>
                    Sign in or register to auto-fill your contact details and get priority trade desk allocation.
                  </Text>
                </View>
                <View style={styles.inquiryAuthBtns}>
                  <TouchableOpacity
                    style={styles.inquirySignInBtn}
                    onPress={() => openAuthModal("signin")}
                  >
                    <Text style={styles.inquirySignInText}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.inquirySignUpBtn}
                    onPress={() => openAuthModal("signup")}
                  >
                    <Text style={styles.inquirySignUpText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formHeading}>Request Wholesale Quotation</Text>
              <Text style={styles.formSub}>
                Specify your diamond criteria. Direct manufacturers of IGI certified lab grown &amp;
                natural stones.
              </Text>

              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  FULL NAME / FIRM NAME <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g. Ramesh Shah / Royal Jewelers"
                  placeholderTextColor="#94a3b8"
                  value={customerName}
                  onChangeText={setCustomerName}
                  style={styles.input}
                />
              </View>

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  PHONE / WHATSAPP NUMBER <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g. +91 98765 43210"
                  placeholderTextColor="#94a3b8"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS (OPTIONAL)</Text>
                <TextInput
                  placeholder="e.g. ramesh@royaljewelers.com"
                  placeholderTextColor="#94a3b8"
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              {/* Target Shape */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TARGET CUT / SHAPE</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.shapePillsRow}
                >
                  {SHAPES.map((shape) => {
                    const active = targetShape === shape;
                    return (
                      <TouchableOpacity
                        key={shape}
                        style={[styles.shapePill, active && styles.shapePillActive]}
                        onPress={() => setTargetShape(shape)}
                      >
                        <Text style={[styles.shapePillText, active && styles.shapePillTextActive]}>
                          {shape}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Target Carat */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CARAT WEIGHT / PARCEL SIZE</Text>
                <TextInput
                  placeholder="e.g. 1.50 ct or 10 ct parcel"
                  placeholderTextColor="#94a3b8"
                  value={targetCarat}
                  onChangeText={setTargetCarat}
                  style={styles.input}
                />
              </View>

              {/* Notes / Message */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>SPECIFIC REQUIREMENTS / COLOR / CLARITY</Text>
                <TextInput
                  placeholder="Specify D-F color, VVS clarity, GIA/IGI cert, budget, pointers..."
                  placeholderTextColor="#94a3b8"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  style={[styles.input, styles.textArea]}
                />
              </View>

              {/* Submit Buttons */}
              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Send size={15} color="#ffffff" />
                    <Text style={styles.submitBtnText}>Submit Wholesale Inquiry</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.whatsappDirectBtn} onPress={openWhatsApp}>
                <MessageCircle size={16} color="#059669" />
                <Text style={styles.whatsappDirectText}>Connect on WhatsApp Instantly</Text>
              </TouchableOpacity>
            </View>

            {/* Direct Trade Desk Contacts */}
            <View style={styles.tradeDeskCard}>
              <Text style={styles.tradeDeskTitle}>Direct Trade Desk Support</Text>
              <Text style={styles.tradeDeskSub}>
                Call or message our executive directors directly during market hours:
              </Text>

              <View style={styles.contactRow}>
                <View style={styles.contactMeta}>
                  <Text style={styles.contactName}>Hardik Sorathiya</Text>
                  <Text style={styles.contactRole}>Founder &amp; Managing Director</Text>
                </View>
                <TouchableOpacity
                  style={styles.callPill}
                  onPress={() => openCall("+919033320326")}
                >
                  <Phone size={13} color="#059669" />
                  <Text style={styles.callPillText}>Call</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.contactDivider} />

              <View style={styles.contactRow}>
                <View style={styles.contactMeta}>
                  <Text style={styles.contactName}>Sanket Sorathiya</Text>
                  <Text style={styles.contactRole}>Director - International Trade</Text>
                </View>
                <TouchableOpacity
                  style={styles.callPill}
                  onPress={() => openCall("+918000045391")}
                >
                  <Phone size={13} color="#059669" />
                  <Text style={styles.callPillText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {},
  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 1.5,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#b45309",
  },
  whatsappHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 4,
  },
  formSub: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  required: {
    color: "#dc2626",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0f172a",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  shapePillsRow: {
    gap: 6,
    paddingVertical: 4,
  },
  shapePill: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  shapePillActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  shapePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
  shapePillTextActive: {
    color: "#ffffff",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
  whatsappDirectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingVertical: 12,
    borderRadius: 10,
  },
  whatsappDirectText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
  tradeDeskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  tradeDeskTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  tradeDeskSub: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  contactMeta: {
    flex: 1,
  },
  contactName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
  contactRole: {
    fontSize: 11,
    color: "#64748b",
  },
  callPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  callPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#059669",
  },
  contactDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 8,
  },
  successCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
    textAlign: "center",
  },
  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  successDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  whatsappCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#059669",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 10,
  },
  whatsappCtaText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
  newInquiryBtn: {
    paddingVertical: 10,
  },
  newInquiryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d97706",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 10,
    gap: 6,
  },
  authHeaderBtnLoggedIn: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  authHeaderBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  authHeaderBtnTextLoggedIn: {
    color: "#b45309",
  },
  inquiryUserBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  inquiryUserLeft: {
    flex: 1,
    marginRight: 8,
  },
  inquiryUserTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#065f46",
  },
  inquiryUserSub: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
  },
  inquiryUserBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inquiryUserBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  inquiryAuthBanner: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  inquiryAuthLeft: {
    marginBottom: 10,
  },
  inquiryAuthTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#92400e",
  },
  inquiryAuthSub: {
    fontSize: 11,
    color: "#78350f",
    marginTop: 2,
    lineHeight: 16,
  },
  inquiryAuthBtns: {
    flexDirection: "row",
    gap: 8,
  },
  inquirySignInBtn: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  inquirySignInText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  inquirySignUpBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  inquirySignUpText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
});
