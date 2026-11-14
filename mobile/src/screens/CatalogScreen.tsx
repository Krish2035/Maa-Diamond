import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { Search, Sparkles, Filter, X, MessageCircle, User as UserIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DiamondCard from "../components/DiamondCard";
import { Diamond, DiamondShape } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SHAPES: (DiamondShape | "All")[] = [
  "All",
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

interface Props {
  navigation: any;
  route?: any;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  selectedShape?: string;
  onSelectShape?: (shape: string) => void;
}

export default function CatalogScreen({
  navigation,
  route,
  wishlist,
  onToggleWishlist,
  selectedShape: propShape,
  onSelectShape: propSetShape,
}: Props) {
  const insets = useSafeAreaInsets();
  const { currentUser, openAuthModal } = useAuth();
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [internalShape, setInternalShape] = useState<string>("All");

  const selectedShape = propShape ?? internalShape;
  const setSelectedShape = propSetShape ?? setInternalShape;
  const [searchQuery, setSearchQuery] = useState("");

  // Inquiry Modal state
  const [inquiryDiamond, setInquiryDiamond] = useState<Diamond | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const fetchDiamonds = useCallback(async () => {
    try {
      const data = await api.getDiamonds(
        selectedShape === "All" ? undefined : selectedShape
      );
      setDiamonds(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedShape]);

  useEffect(() => {
    setLoading(true);
    fetchDiamonds();
  }, [fetchDiamonds]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDiamonds();
  };

  const filteredDiamonds = diamonds.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.stockNumber?.toLowerCase().includes(q) ||
      d.shape?.toLowerCase().includes(q) ||
      d.certificateNo?.toLowerCase().includes(q) ||
      d.color?.toLowerCase().includes(q) ||
      d.clarity?.toLowerCase().includes(q)
    );
  });

  const handleOpenInquiry = (diamond: Diamond) => {
    setInquiryDiamond(diamond);
    if (currentUser) {
      setCustomerName(currentUser.name || "");
      setCustomerPhone(currentUser.phone || "");
    }
  };

  const handleSubmitInquiry = async () => {
    if (!customerName || !customerPhone) {
      Alert.alert("Missing Details", "Please provide your name and phone number.");
      return;
    }
    setSubmittingInquiry(true);
    try {
      await api.submitInquiry({
        customerName,
        customerPhone,
        diamondId: inquiryDiamond?.id,
        diamondStockNumber: inquiryDiamond?.stockNumber,
        targetShape: inquiryDiamond?.shape,
        targetCarat: inquiryDiamond?.carat,
        notes: `Inquiry via Maa Diamond Mobile App for ${inquiryDiamond?.stockNumber}`,
      });
      Alert.alert(
        "Inquiry Sent",
        `Thank you ${customerName}! Our trade desk will contact you regarding ${inquiryDiamond?.stockNumber}.`
      );
      setInquiryDiamond(null);
      setCustomerName("");
      setCustomerPhone("");
    } catch {
      Alert.alert("Notice", "Inquiry noted. Please connect via WhatsApp for immediate quote.");
      setInquiryDiamond(null);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Header with Dynamic Status Bar Safe Inset */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>MAA DIAMOND</Text>
          <View style={styles.verifiedTag}>
            <Sparkles size={11} color="#d97706" />
            <Text style={styles.verifiedText}>Lab Grown &amp; Natural Master Cut</Text>
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

          <TouchableOpacity
            style={styles.whatsappHeaderBtn}
            onPress={() =>
              Linking.openURL(
                "https://wa.me/919033320326?text=" +
                  encodeURIComponent("Hello Maa Diamond! I am viewing your certified diamond vault.")
              )
            }
          >
            <MessageCircle size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          placeholder="Search stock #, shape, cert # (e.g. Round, VVS1)..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={16} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Shape Filter Pills */}
      <View style={styles.shapeScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shapeScroll}
        >
          {SHAPES.map((shape) => {
            const active = selectedShape === shape;
            return (
              <TouchableOpacity
                key={shape}
                onPress={() => setSelectedShape(shape)}
                style={[styles.shapePill, active && styles.shapePillActive]}
              >
                <Text
                  style={[styles.shapePillText, active && styles.shapePillTextActive]}
                >
                  {shape}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Inventory List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#d97706" />
          <Text style={styles.loadingText}>Loading Live Diamond Vault...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDiamonds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DiamondCard
              diamond={item}
              isWishlisted={wishlist.includes(item.id)}
              onToggleWishlist={onToggleWishlist}
              onSelect={(d) => navigation.navigate("DiamondDetail", { diamond: d })}
              onInquire={(d) => handleOpenInquiry(d)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#d97706"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Filter size={32} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Diamonds Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search query or shape filter.
              </Text>
            </View>
          }
        />
      )}

      {/* Quick Wholesale Inquiry Modal */}
      <Modal
        visible={Boolean(inquiryDiamond)}
        transparent
        animationType="fade"
        onRequestClose={() => setInquiryDiamond(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Wholesale Inquiry Desk</Text>
              <TouchableOpacity onPress={() => setInquiryDiamond(null)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalStone}>
              Stone: {inquiryDiamond?.shape} Diamond ({inquiryDiamond?.stockNumber} -{" "}
              {inquiryDiamond?.color}/{inquiryDiamond?.clarity})
            </Text>

            {currentUser ? (
              <View style={styles.modalUserBadge}>
                <Text style={styles.modalUserBadgeText}>
                  ✓ Verified Merchant: {currentUser.name}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.modalAuthHint}
                onPress={() => {
                  setInquiryDiamond(null);
                  openAuthModal("signin");
                }}
              >
                <Text style={styles.modalAuthHintText}>
                  Registered merchant? <Text style={{ fontWeight: "800", color: "#d97706" }}>Sign In</Text> to auto-fill
                </Text>
              </TouchableOpacity>
            )}

            <TextInput
              placeholder="Your Full Name *"
              placeholderTextColor="#94a3b8"
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.modalInput}
            />

            <TextInput
              placeholder="Mobile Phone / WhatsApp Number *"
              placeholderTextColor="#94a3b8"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleSubmitInquiry}
              disabled={submittingInquiry}
            >
              {submittingInquiry ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.modalSubmitText}>Submit Trade RFQ</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {},
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#dc2626",
    borderRadius: 7,
    paddingHorizontal: 4,
    minWidth: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
  whatsappHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 12,
    color: "#0f172a",
  },
  shapeScrollWrapper: {
    marginVertical: 10,
  },
  shapeScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  shapePill: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shapePillActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  shapePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  shapePillTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  modalStone: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d97706",
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#0f172a",
    marginBottom: 10,
  },
  modalSubmitBtn: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  modalSubmitText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  modalUserBadge: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  modalUserBadgeText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "700",
  },
  modalAuthHint: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  modalAuthHintText: {
    fontSize: 11,
    color: "#92400e",
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
});

