import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  Share2,
  Gem,
  User as UserIcon,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function DigitalCardScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, openAuthModal } = useAuth();
  const openCall = (num: string) => Linking.openURL(`tel:${num}`);
  const openWhatsApp = (num: string) => Linking.openURL(`https://wa.me/${num}`);
  const openMail = () => Linking.openURL("mailto:info@maadiamond.com");
  const openMaps = () =>
    Linking.openURL(
      "https://maps.google.com/?q=Akshar+Diamond+Market+Mangadh+Chowk+Mini+Bazaar+Varachha+Surat"
    );
  const openWebsite = () => Linking.openURL("https://maa-diamond.vercel.app");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 12) + 12 },
      ]}
    >
      {/* Card Header Container */}
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Gem size={32} color="#ffffff" />
        </View>
        <Text style={styles.brandName}>MAA DIAMOND</Text>
        <Text style={styles.tagline}>
          Direct Manufacturers of IGI Certified Lab Grown &amp; Natural Loose Diamonds
        </Text>
        <View style={styles.bourseBadge}>
          <Text style={styles.bourseText}>SURAT DIAMOND BOURSE TRADERS</Text>
        </View>
      </View>

      {/* Wholesale Merchant Account Card */}
      <View style={styles.accountCard}>
        {currentUser ? (
          <View style={styles.accountLoggedInRow}>
            <View style={styles.accountAvatar}>
              <Text style={styles.accountAvatarText}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "M"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accountName}>{currentUser.name}</Text>
              <Text style={styles.accountCompany}>
                {currentUser.companyName || "Verified Wholesale Merchant"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.accountActionBtn}
              onPress={() => openAuthModal("signin")}
            >
              <Text style={styles.accountActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.accountLoggedOutRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.accountTitle}>Merchant Sign In &amp; Register</Text>
              <Text style={styles.accountSubtitle}>
                Access wholesale diamond terms, order history and direct trade desk support.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.accountSignInBtn}
              onPress={() => openAuthModal("signin")}
            >
              <UserIcon size={13} color="#ffffff" />
              <Text style={styles.accountSignInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Directors Section */}
      <View style={styles.directorsCard}>
        <Text style={styles.sectionHeader}>LEADERSHIP &amp; TRADE DESK</Text>

        {/* Hardik Sorathiya */}
        <View style={styles.directorBlock}>
          <View style={styles.directorInfo}>
            <Text style={styles.directorName}>Hardik Sorathiya</Text>
            <Text style={styles.directorRole}>Founder &amp; Managing Director</Text>
            <Text style={styles.directorPhone}>+91 90333 20326</Text>
          </View>
          <View style={styles.actionPills}>
            <TouchableOpacity
              style={styles.iconBtnCall}
              onPress={() => openCall("+919033320326")}
            >
              <Phone size={15} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtnWa}
              onPress={() => openWhatsApp("919033320326")}
            >
              <MessageCircle size={15} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Sanket Sorathiya */}
        <View style={styles.directorBlock}>
          <View style={styles.directorInfo}>
            <Text style={styles.directorName}>Sanket Sorathiya</Text>
            <Text style={styles.directorRole}>Director - International Trade</Text>
            <Text style={styles.directorPhone}>+91 80000 45391</Text>
          </View>
          <View style={styles.actionPills}>
            <TouchableOpacity
              style={styles.iconBtnCall}
              onPress={() => openCall("+918000045391")}
            >
              <Phone size={15} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtnWa}
              onPress={() => openWhatsApp("918000045391")}
            >
              <MessageCircle size={15} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Physical Trading Office Address */}
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <MapPin size={18} color="#d97706" />
          <Text style={styles.addressTitle}>TRADING HEADQUARTERS</Text>
        </View>
        <Text style={styles.addressText}>
          217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat, 395006
        </Text>
        <TouchableOpacity style={styles.mapsBtn} onPress={openMaps}>
          <MapPin size={14} color="#b45309" />
          <Text style={styles.mapsBtnText}>Open in Google Maps GPS</Text>
        </TouchableOpacity>
      </View>

      {/* Online Links */}
      <View style={styles.linksCard}>
        <TouchableOpacity style={styles.linkRow} onPress={openMail}>
          <Mail size={16} color="#2563eb" />
          <Text style={styles.linkText}>info@maadiamond.com</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.linkRow} onPress={openWebsite}>
          <Globe size={16} color="#059669" />
          <Text style={styles.linkText}>maa-diamond.vercel.app</Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  cardHeader: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(217, 119, 6, 0.25)",
    borderWidth: 1.5,
    borderColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 12,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 12,
  },
  bourseBadge: {
    backgroundColor: "rgba(217, 119, 6, 0.2)",
    borderWidth: 1,
    borderColor: "#f59e0b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  bourseText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#fbbf24",
    letterSpacing: 1,
  },
  directorsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 12,
  },
  directorBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  directorInfo: {
    flex: 1,
  },
  directorName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  directorRole: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
  },
  directorPhone: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b45309",
    marginTop: 2,
  },
  actionPills: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtnCall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0284c7",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnWa: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 10,
  },
  addressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 10,
  },
  mapsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 10,
    paddingVertical: 8,
  },
  mapsBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400e",
  },
  linksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  accountCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  accountLoggedInRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  accountAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  accountAvatarText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  accountName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },
  accountCompany: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  accountActionBtn: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  accountActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  accountLoggedOutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accountTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
  accountSubtitle: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 15,
    marginTop: 2,
  },
  accountSignInBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#0f172a",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  accountSignInText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
});

