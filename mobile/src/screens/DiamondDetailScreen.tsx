import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import {
  ShieldCheck,
  Heart,
  MessageCircle,
  FileText,
  CheckCircle2,
  Play,
  RotateCw,
  ExternalLink,
} from "lucide-react-native";
import { Diamond } from "../types";
import { getMediaUrl } from "../services/api";

interface Props {
  route: any;
  navigation: any;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export default function DiamondDetailScreen({
  route,
  navigation,
  wishlist,
  onToggleWishlist,
}: Props) {
  const diamond: Diamond = route.params.diamond;
  const isWishlisted = wishlist.includes(diamond.id);
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Maa Diamond Trade Desk! I am interested in Stone ${diamond.stockNumber} (${diamond.carat} ct ${diamond.shape}, Color: ${diamond.color}, Clarity: ${diamond.clarity}, Lab: ${diamond.lab} ${diamond.certificateNo}). Please share wholesale quote.`
    );
    Linking.openURL(`https://wa.me/919033320326?text=${text}`);
  };

  const handlePlayVideo = async () => {
    const videoUrl = getMediaUrl(diamond.videoUrl);
    if (!videoUrl) {
      Alert.alert(
        "360° Video",
        `360° video for ${diamond.shape} Diamond (${diamond.stockNumber}) is currently being prepared.`
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(videoUrl).catch(() => true);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert("Unable to Play Video", `Cannot open video stream: ${videoUrl}`);
      }
    } catch (err: any) {
      Alert.alert("Video Playback", err?.message || "Could not launch video player.");
    }
  };

  const imageUrl = getMediaUrl(diamond.imageUrl);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Media Showcase - Pure Black Solid Canvas */}
      <View style={styles.mediaContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.mediaImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.mediaPlaceholder}>
            <Text style={styles.mediaPlaceholderText}>{diamond.shape} Diamond</Text>
          </View>
        )}

        {/* Certificate Tag */}
        <View style={styles.certBadge}>
          <ShieldCheck size={13} color="#fbbf24" />
          <Text style={styles.certText}>
            {diamond.lab} {diamond.certificateNo}
          </Text>
        </View>

        {/* Floating 360° Video Play Button directly on showcase */}
        <TouchableOpacity
          style={styles.floatingVideoBtn}
          activeOpacity={0.8}
          onPress={handlePlayVideo}
        >
          <Play size={12} color="#fbbf24" fill="#fbbf24" />
          <Text style={styles.floatingVideoText}>360° Video</Text>
        </TouchableOpacity>

        {/* Wishlist Floating Button */}
        <TouchableOpacity
          style={styles.wishlistFloat}
          onPress={() => onToggleWishlist(diamond.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={18}
            color={isWishlisted ? "#f43f5e" : "#64748b"}
            fill={isWishlisted ? "#f43f5e" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Media Mode Segmented Switcher */}
      <View style={styles.mediaSwitcherRow}>
        <TouchableOpacity
          style={[styles.mediaSwitchTab, activeMedia === "image" && styles.mediaSwitchTabActive]}
          onPress={() => setActiveMedia("image")}
        >
          <Text
            style={[
              styles.mediaSwitchText,
              activeMedia === "image" && styles.mediaSwitchTextActive,
            ]}
          >
            📷 Pure Black HD Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mediaSwitchTab, activeMedia === "video" && styles.mediaSwitchTabActive]}
          onPress={() => {
            setActiveMedia("video");
            handlePlayVideo();
          }}
        >
          <Play size={12} color={activeMedia === "video" ? "#ffffff" : "#d97706"} fill={activeMedia === "video" ? "#ffffff" : "#d97706"} />
          <Text
            style={[
              styles.mediaSwitchText,
              activeMedia === "video" && styles.mediaSwitchTextActive,
            ]}
          >
            Play 360° Video
          </Text>
        </TouchableOpacity>
      </View>

      {/* 360° Video Interactive Hero Banner */}
      <View style={styles.videoBannerCard}>
        <View style={styles.videoBannerLeft}>
          <View style={styles.videoBadge}>
            <RotateCw size={11} color="#b45309" />
            <Text style={styles.videoBadgeText}>INTERACTIVE 360° INSPECTION</Text>
          </View>
          <Text style={styles.videoBannerTitle}>
            Rotate &amp; Inspect in 360°
          </Text>
          <Text style={styles.videoBannerDesc}>
            Watch high-definition rotating video of this {diamond.shape} cut on black pedestal.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playActionBtn}
          activeOpacity={0.8}
          onPress={handlePlayVideo}
        >
          <Play size={14} color="#0f172a" fill="#0f172a" />
          <Text style={styles.playActionBtnText}>Play Video</Text>
          <ExternalLink size={12} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Main Title & Stock Number */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <View style={styles.shapePill}>
            <Text style={styles.shapePillText}>{diamond.shape} Cut</Text>
          </View>
          <View style={styles.availabilityPill}>
            <CheckCircle2 size={11} color="#059669" />
            <Text style={styles.availabilityText}>In Vault Inventory</Text>
          </View>
        </View>

        <Text style={styles.diamondHeading}>
          {diamond.carat} Carat {diamond.shape} Diamond
        </Text>
        <Text style={styles.stockSub}>Stock ID: {diamond.stockNumber}</Text>
      </View>

      {/* 4Cs Metric Grid */}
      <View style={styles.fourCsCard}>
        <Text style={styles.sectionTitle}>THE 4CS SPECIFICATIONS</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>CARAT WEIGHT</Text>
            <Text style={styles.gridValue}>{diamond.carat} CT</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>COLOR GRADE</Text>
            <Text style={styles.gridValue}>{diamond.color}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>CLARITY GRADE</Text>
            <Text style={styles.gridValue}>{diamond.clarity}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>CUT GRADE</Text>
            <Text style={styles.gridValue}>{diamond.cut}</Text>
          </View>
        </View>
      </View>

      {/* Polish, Symmetry & Lab details */}
      <View style={styles.specsCard}>
        <Text style={styles.sectionTitle}>LABORATORY &amp; FACETING</Text>

        <View style={styles.specRow}>
          <Text style={styles.specName}>Polish</Text>
          <Text style={styles.specValue}>{diamond.polish || "Excellent"}</Text>
        </View>
        <View style={styles.specDivider} />

        <View style={styles.specRow}>
          <Text style={styles.specName}>Symmetry</Text>
          <Text style={styles.specValue}>{diamond.symmetry || "Excellent"}</Text>
        </View>
        <View style={styles.specDivider} />

        <View style={styles.specRow}>
          <Text style={styles.specName}>Fluorescence</Text>
          <Text style={styles.specValue}>{diamond.fluorescence || "None"}</Text>
        </View>
        <View style={styles.specDivider} />

        <View style={styles.specRow}>
          <Text style={styles.specName}>Dimensions</Text>
          <Text style={styles.specValue}>{diamond.dimensions || "N/A"}</Text>
        </View>
        <View style={styles.specDivider} />

        <View style={styles.specRow}>
          <Text style={styles.specName}>Grading Lab</Text>
          <Text style={styles.specValue}>{diamond.lab}</Text>
        </View>
      </View>

      {/* Notes / Description */}
      {diamond.description ? (
        <View style={styles.descCard}>
          <Text style={styles.sectionTitle}>STONE OVERVIEW</Text>
          <Text style={styles.descText}>{diamond.description}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.inquiryBtn}
          onPress={() => {
            Alert.alert(
              "Wholesale Inquiry",
              `Direct quote for ${diamond.shape} Diamond (${diamond.stockNumber}). Connect directly on WhatsApp with our trading desk for immediate pricing.`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Open WhatsApp", onPress: openWhatsApp },
              ]
            );
          }}
        >
          <FileText size={16} color="#0f172a" />
          <Text style={styles.inquiryBtnText}>Inquiry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <MessageCircle size={16} color="#ffffff" />
          <Text style={styles.whatsappBtnText}>WhatsApp Trade Desk</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingBottom: 40,
  },
  mediaContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  mediaImage: {
    width: "88%",
    height: "88%",
  },
  mediaPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  mediaPlaceholderText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
  },
  certBadge: {
    position: "absolute",
    bottom: 12,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  certText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  floatingVideoBtn: {
    position: "absolute",
    bottom: 12,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  floatingVideoText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  wishlistFloat: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mediaSwitcherRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 8,
  },
  mediaSwitchTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  mediaSwitchTabActive: {
    backgroundColor: "#0f172a",
  },
  mediaSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
  mediaSwitchTextActive: {
    color: "#ffffff",
  },
  videoBannerCard: {
    backgroundColor: "#fffbeb",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fde68a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  videoBannerLeft: {
    flex: 1,
  },
  videoBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  videoBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#b45309",
    letterSpacing: 0.5,
  },
  videoBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  videoBannerDesc: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 14,
  },
  playActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  playActionBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
  },
  titleSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginTop: 14,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  shapePill: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shapePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  availabilityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  diamondHeading: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 2,
  },
  stockSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    fontFamily: "monospace",
  },
  fourCsCard: {
    backgroundColor: "#ffffff",
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
    paddingVertical: 8,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
  },
  specsCard: {
    backgroundColor: "#ffffff",
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  specName: {
    fontSize: 13,
    color: "#64748b",
  },
  specValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  specDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  descCard: {
    backgroundColor: "#ffffff",
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  descText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginHorizontal: 16,
  },
  inquiryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 12,
  },
  inquiryBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
  whatsappBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 12,
  },
  whatsappBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
});
