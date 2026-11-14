import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Lock, Mail, User as UserIcon, Building2, Phone, LogOut, CheckCircle2, Sparkles } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const {
    currentUser,
    authModalVisible,
    closeAuthModal,
    authInitialTab,
    signIn,
    signUp,
    demoSignIn,
    signOut,
  } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (authModalVisible && authInitialTab) {
      setTab(authInitialTab);
    }
  }, [authModalVisible, authInitialTab]);

  // Sign In fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up fields
  const [regName, setRegName] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async () => {
    setErrorMsg("");
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    try {
      await signIn(loginEmail.trim(), loginPassword);
      setLoginEmail("");
      setLoginPassword("");
    } catch (e: any) {
      setErrorMsg(e.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setErrorMsg("");
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg("Name, email and password are required fields.");
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        companyName: regCompany.trim(),
        phone: regPhone.trim(),
      });
      setRegName("");
      setRegCompany("");
      setRegPhone("");
      setRegEmail("");
      setRegPassword("");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await demoSignIn();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={authModalVisible}
      animationType="slide"
      transparent
      onRequestClose={closeAuthModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Sparkles size={16} color="#d97706" />
              </View>
              <Text style={styles.sheetTitle}>
                {currentUser ? "Merchant Profile" : "Wholesale Account"}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeAuthModal}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {currentUser ? (
              /* Profile Card when Logged In */
              <View style={styles.profileBox}>
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarLargeText}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "M"}
                  </Text>
                </View>

                <Text style={styles.profileName}>{currentUser.name}</Text>
                <Text style={styles.profileEmail}>{currentUser.email}</Text>

                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>VERIFIED WHOLESALE MERCHANT</Text>
                </View>

                <View style={styles.metaCard}>
                  {currentUser.companyName ? (
                    <View style={styles.metaRow}>
                      <Building2 size={16} color="#64748b" />
                      <Text style={styles.metaLabel}>Company:</Text>
                      <Text style={styles.metaValue}>{currentUser.companyName}</Text>
                    </View>
                  ) : null}

                  {currentUser.phone ? (
                    <View style={styles.metaRow}>
                      <Phone size={16} color="#64748b" />
                      <Text style={styles.metaLabel}>Mobile:</Text>
                      <Text style={styles.metaValue}>{currentUser.phone}</Text>
                    </View>
                  ) : null}

                  <View style={styles.metaRow}>
                    <CheckCircle2 size={16} color="#059669" />
                    <Text style={styles.metaLabel}>Status:</Text>
                    <Text style={[styles.metaValue, { color: "#059669", fontWeight: "800" }]}>
                      Active Trade Desk Access
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
                  <LogOut size={16} color="#dc2626" />
                  <Text style={styles.logoutBtnText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Sign In / Sign Up Form */
              <>
                {/* Tabs Switcher */}
                <View style={styles.tabSwitcher}>
                  <TouchableOpacity
                    style={[styles.tabBtn, tab === "signin" && styles.tabBtnActive]}
                    onPress={() => {
                      setTab("signin");
                      setErrorMsg("");
                    }}
                  >
                    <Text style={[styles.tabText, tab === "signin" && styles.tabTextActive]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, tab === "signup" && styles.tabBtnActive]}
                    onPress={() => {
                      setTab("signup");
                      setErrorMsg("");
                    }}
                  >
                    <Text style={[styles.tabText, tab === "signup" && styles.tabTextActive]}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>

                {errorMsg ? (
                  <View style={styles.errorAlert}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                {tab === "signin" ? (
                  /* Sign In Fields */
                  <View style={styles.formCol}>
                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                      <View style={styles.inputBox}>
                        <Mail size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="merchant@example.com"
                          placeholderTextColor="#94a3b8"
                          value={loginEmail}
                          onChangeText={setLoginEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>PASSWORD</Text>
                      <View style={styles.inputBox}>
                        <Lock size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="Enter your password"
                          placeholderTextColor="#94a3b8"
                          value={loginPassword}
                          onChangeText={setLoginPassword}
                          secureTextEntry
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryActionBtn, loading && styles.btnDisabled]}
                      onPress={handleSignIn}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.primaryActionBtnText}>Sign In to Account</Text>
                      )}
                    </TouchableOpacity>

                    {/* Quick Demo Login Option */}
                    <TouchableOpacity
                      style={styles.demoLoginBtn}
                      onPress={handleDemoSignIn}
                    >
                      <Sparkles size={14} color="#d97706" />
                      <Text style={styles.demoLoginBtnText}>Instant Demo Wholesale Login</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Sign Up Fields */
                  <View style={styles.formCol}>
                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>
                        FULL NAME <Text style={styles.reqStar}>*</Text>
                      </Text>
                      <View style={styles.inputBox}>
                        <UserIcon size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="e.g. Ramesh Shah"
                          placeholderTextColor="#94a3b8"
                          value={regName}
                          onChangeText={setRegName}
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>COMPANY / FIRM NAME</Text>
                      <View style={styles.inputBox}>
                        <Building2 size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="e.g. Royal Jewelers &amp; Sons"
                          placeholderTextColor="#94a3b8"
                          value={regCompany}
                          onChangeText={setRegCompany}
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>MOBILE / WHATSAPP NUMBER</Text>
                      <View style={styles.inputBox}>
                        <Phone size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="e.g. +91 98251 12345"
                          placeholderTextColor="#94a3b8"
                          value={regPhone}
                          onChangeText={setRegPhone}
                          keyboardType="phone-pad"
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>
                        EMAIL ADDRESS <Text style={styles.reqStar}>*</Text>
                      </Text>
                      <View style={styles.inputBox}>
                        <Mail size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="e.g. ramesh@royaljewelers.com"
                          placeholderTextColor="#94a3b8"
                          value={regEmail}
                          onChangeText={setRegEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <View style={styles.inputWrap}>
                      <Text style={styles.inputLabel}>
                        PASSWORD (MIN 6 CHARS) <Text style={styles.reqStar}>*</Text>
                      </Text>
                      <View style={styles.inputBox}>
                        <Lock size={16} color="#94a3b8" style={styles.inputIcon} />
                        <TextInput
                          placeholder="Create strong password"
                          placeholderTextColor="#94a3b8"
                          value={regPassword}
                          onChangeText={setRegPassword}
                          secureTextEntry
                          style={styles.textInput}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryActionBtn, loading && styles.btnDisabled]}
                      onPress={handleSignUp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.primaryActionBtnText}>Create Merchant Account</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 9,
  },
  tabBtnActive: {
    backgroundColor: "#0f172a",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "600",
  },
  formCol: {
    gap: 12,
  },
  inputWrap: {
    marginBottom: 2,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  reqStar: {
    color: "#dc2626",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: "#0f172a",
  },
  primaryActionBtn: {
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
  demoLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 4,
  },
  demoLoginBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#92400e",
  },
  profileBox: {
    alignItems: "center",
    paddingTop: 8,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  avatarLargeText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f59e0b",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  profileEmail: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400e",
    letterSpacing: 0.5,
  },
  metaCard: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    width: 75,
  },
  metaValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#dc2626",
  },
});
