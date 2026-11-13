import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  Heart,
  ShieldCheck,
  Play,
  FileText,
  MessageCircle,
} from "lucide-react-native";
import { Diamond } from "../types";

interface Props {
  diamond: Diamond;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelect: (diamond: Diamond) => void;
  onInquire: (diamond: Diamond) => void;
}

export default function DiamondCard({
  diamond,
  isWishlisted,
  onToggleWishlist,
  onSelect,
  onInquire,
}: Props) {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Maa Diamond! I am inquiring about ${diamond.shape} Diamond (${diamond.stockNumber}, Color: ${diamond.color}, Clarity: ${diamond.clarity}, Lab: ${diamond.lab} ${diamond.certificateNo}). Is this available?`
    );
    Linking.openURL(`https://wa.me/919033320326?text=${text}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onSelect(diamond)}
      style={styles.card}
    >
      {/* Top Meta Bar */}
      <View style={styles.topBar}>
        <View style={styles.shapeBadge}>
          <Text style={styles.shapeText}>{diamond.shape} Cut</Text>
        </View>

        <TouchableOpacity
          onPress={() => onToggleWishlist(diamond.id)}
          style={[styles.wishButton, isWishlisted && styles.wishButtonActive]}
        >
          <Heart
            size={16}
            color={isWishlisted ? "#f43f5e" : "#94a3b8"}
            fill={isWishlisted ? "#f43f5e" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Diamond Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              diamond.imageUrl ||
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
          }}
          style={styles.diamondImage}
          resizeMode="contain"
        />

        {/* Certificate Badge (Bottom-Left) */}
        <View style={styles.certBadge}>
          <ShieldCheck size={12} color="#2563eb" />
          <Text style={styles.certText}>
            {diamond.lab} {diamond.certificateNo}
          </Text>
        </View>

        {/* Transparent Video Button (Bottom-Right, matching user's web requirement) */}
        <TouchableOpacity
          style={styles.videoButton}
          activeOpacity={0.8}
          onPress={() => onSelect(diamond)}
        >
          <Play size={10} color="#fbbf24" fill="#fbbf24" />
          <Text style={styles.videoButtonText}>Video</Text>
        </TouchableOpacity>
      </View>

      {/* Stock Title */}
      <View style={styles.infoRow}>
        <Text style={styles.diamondTitle}>{diamond.shape} Diamond</Text>
        <Text style={styles.stockNumber}>{diamond.stockNumber}</Text>
      </View>

      {/* 4Cs Metric Bar */}
      <View style={styles.fourCsBar}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>COLOR</Text>
          <Text style={styles.metricValue}>{diamond.color}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>CLARITY</Text>
          <Text style={styles.metricValue}>{diamond.clarity}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>CUT</Text>
          <Text style={styles.metricValue}>{diamond.cut?.split(" ")[0] || "Ex"}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>POLISH</Text>
          <Text style={styles.metricValue}>{diamond.polish?.substring(0, 4) || "Ex"}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.inquiryBtn}
          onPress={() => onInquire(diamond)}
        >
          <FileText size={14} color="#334155" />
          <Text style={styles.inquiryText}>Inquiry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <MessageCircle size={14} color="#ffffff" />
          <Text style={styles.whatsappText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  shapeBadge: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shapeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  wishButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  wishButtonActive: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 12,
  },
  diamondImage: {
    width: "80%",
    height: "80%",
  },
  certBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  certText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#334155",
  },
  videoButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  diamondTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  stockNumber: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    fontFamily: "monospace",
  },
  fourCsBar: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
  },
  metricDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
    height: "100%",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  inquiryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 9,
    borderRadius: 10,
  },
  inquiryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#059669",
    paddingVertical: 9,
    borderRadius: 10,
  },
  whatsappText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
});

