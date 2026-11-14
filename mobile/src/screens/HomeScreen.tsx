import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Gem,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Building2,
  MessageCircle,
  FileText,
  MapPin,
  ChevronRight,
  Phone,
  User as UserIcon,
} from "lucide-react-native";
import { DiamondShape } from "../types";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const POPULAR_SHAPES: { shape: DiamondShape; label: string; icon: string; desc: string }[] = [
  { shape: "Round", label: "Round Brilliant", icon: "💎", desc: "Classic 57 Facet Fire" },
  { shape: "Marquise", label: "Marquise Cut", icon: "✨", desc: "Elongated Royal Elegance" },
  { shape: "Pear", label: "Pear Teardrop", icon: "💧", desc: "Brilliant Tear Silhouette" },
  { shape: "Princess", label: "Princess Cut", icon: "🔷", desc: "Modern Square Brilliance" },
  { shape: "Emerald", label: "Emerald Step", icon: "🏛️", desc: "Hall-of-Mirrors Luster" },
  { shape: "Oval", label: "Oval Cut", icon: "🥚", desc: "Maximized Carat Spread" },
  { shape: "Radiant", label: "Radiant Cut", icon: "🌟", desc: "Vibrant Scintillation" },
  { shape: "Cushion", label: "Cushion Cut", icon: "🛋️", desc: "Pillow Vintage Charm" },
];

interface Props {
  navigation: any;
  wishlist: string[];
  onSelectShape: (shape: DiamondShape) => void;
}

export default function HomeScreen({
  navigation,
  wishlist,
  onSelectShape,
}: Props) {
  const insets = useSafeAreaInsets();
  const { currentUser, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "about">("overview");

  const openWhatsApp = () => {
    Linking.openURL(
      "https://wa.me/919033320326?text=" +
        encodeURIComponent(
          "Hello Maa Diamond Trade Desk! I am inquiring about your certified diamonds from your mobile app."
        )
    );
  };

  const openCall = (num: string) => Linking.openURL(`tel:${num}`);

  const handleShapePress = (shape: DiamondShape) => {
    onSelectShape(shape);
    navigation.navigate("ProductsTab");
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
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

          <TouchableOpacity style={styles.whatsappHeaderBtn} onPress={openWhatsApp}>
            <MessageCircle size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Switcher (Overview vs About Us) */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === "overview" && styles.segmentBtnActive]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[styles.segmentText, activeTab === "overview" && styles.segmentTextActive]}
          >
            Overview &amp; Vault
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === "about" && styles.segmentBtnActive]}
          onPress={() => setActiveTab("about")}
        >
          <Text style={[styles.segmentText, activeTab === "about" && styles.segmentTextActive]}>
            About Maa Diamond
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "overview" ? (
          <>
            {/* Hero Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadge}>
                <Sparkles size={12} color="#b45309" />
                <Text style={styles.heroBadgeText}>SURAT DIAMOND BOURSE TRADERS</Text>
              </View>

              <Text style={styles.heroHeadline}>
                Precision Diamond Manufacturing &amp; Global Trading
              </Text>

              <Text style={styles.heroSub}>
                Direct manufacturers of IGI certified lab grown diamonds, CVD, and natural loose
                diamonds. Highest brilliance, fire, and wholesale value for merchants worldwide.
              </Text>

              {/* Action Buttons */}
              <View style={styles.heroActionRow}>
                <TouchableOpacity
                  style={styles.heroPrimaryBtn}
                  onPress={() => navigation.navigate("ProductsTab")}
                >
                  <Text style={styles.heroPrimaryBtnText}>Explore Products</Text>
                  <ArrowRight size={14} color="#0f172a" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.heroWhatsAppBtn} onPress={openWhatsApp}>
                  <MessageCircle size={14} color="#ffffff" />
                  <Text style={styles.heroWhatsAppBtnText}>Trade Desk</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Merchant Account & Sign In Card */}
            <View style={styles.authPromoCard}>
              {currentUser ? (
                <View style={styles.authLoggedInContent}>
                  <View style={styles.authPromoHeader}>
                    <View style={styles.authAvatarSmall}>
                      <Text style={styles.authAvatarSmallText}>
                        {currentUser.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.authPromoInfo}>
                      <Text style={styles.authPromoUser}>{currentUser.name}</Text>
                      <Text style={styles.authPromoRole}>
                        {currentUser.companyName || "Verified Wholesale Merchant"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.authAccountBtn}
                    onPress={() => openAuthModal("signin")}
                  >
                    <UserIcon size={13} color="#0f172a" />
                    <Text style={styles.authAccountBtnText}>Account</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.authLoggedOutContent}>
                  <View style={styles.authPromoBadge}>
                    <Sparkles size={11} color="#d97706" />
                    <Text style={styles.authPromoBadgeText}>EXCLUSIVE MERCHANT ACCESS</Text>
                  </View>
                  <Text style={styles.authPromoTitle}>
                    Wholesale Merchant Sign In &amp; Registration
                  </Text>
                  <Text style={styles.authPromoDesc}>
                    Access real-time parcel availability, submit one-click stone inquiries, and get direct manufacturer rates.
                  </Text>
                  <View style={styles.authBtnRow}>
                    <TouchableOpacity
                      style={styles.authSignInBtn}
                      onPress={() => openAuthModal("signin")}
                    >
                      <UserIcon size={14} color="#ffffff" />
                      <Text style={styles.authSignInBtnText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.authSignUpBtn}
                      onPress={() => openAuthModal("signup")}
                    >
                      <Text style={styles.authSignUpBtnText}>Create Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Quick Shape Selector */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionOverline}>POPULAR CUTS</Text>
                <Text style={styles.sectionHeading}>Browse by Shape</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductsTab")}
                style={styles.viewAllRow}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={14} color="#d97706" />
              </TouchableOpacity>
            </View>

            <View style={styles.shapeGrid}>
              {POPULAR_SHAPES.map((item) => (
                <TouchableOpacity
                  key={item.shape}
                  style={styles.shapeCard}
                  onPress={() => handleShapePress(item.shape)}
                >
                  <Text style={styles.shapeIcon}>{item.icon}</Text>
                  <Text style={styles.shapeCardTitle}>{item.label}</Text>
                  <Text style={styles.shapeCardDesc}>{item.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Three Trust Pillars */}
            <View style={styles.pillarsCard}>
              <Text style={styles.sectionOverline}>MANUFACTURER ADVANTAGE</Text>
              <Text style={styles.pillarsHeading}>Why Merchants Choose Us</Text>

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconBoxAmber}>
                  <ShieldCheck size={20} color="#d97706" />
                </View>
                <View style={styles.pillarTextCol}>
                  <Text style={styles.pillarTitle}>100% Conflict-Free Diamonds</Text>
                  <Text style={styles.pillarDesc}>
                    Strict adherence to the United Nations Kimberley Process. Ethically sourced and
                    manufactured.
                  </Text>
                </View>
              </View>

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconBoxBlue}>
                  <Award size={20} color="#2563eb" />
                </View>
                <View style={styles.pillarTextCol}>
                  <Text style={styles.pillarTitle}>Certified Optical Grading</Text>
                  <Text style={styles.pillarDesc}>
                    Every stone accompanied by verified GIA, IGI or HRD laboratory dossiers.
                  </Text>
                </View>
              </View>

              <View style={styles.pillarItem}>
                <View style={styles.pillarIconBoxGreen}>
                  <Building2 size={20} color="#059669" />
                </View>
                <View style={styles.pillarTextCol}>
                  <Text style={styles.pillarTitle}>Direct Factory Wholesale</Text>
                  <Text style={styles.pillarDesc}>
                    Cut directly at our Varachha facility—zero broker markups, maximum yield value.
                  </Text>
                </View>
              </View>
            </View>

            {/* Fast Inquiry CTA Card */}
            <View style={styles.inquiryCtaCard}>
              <View style={styles.inquiryCtaContent}>
                <Text style={styles.inquiryCtaTitle}>Looking for Custom Parcel or Carat?</Text>
                <Text style={styles.inquiryCtaDesc}>
                  Our trade desk provides custom quotations for calibrated sizes, pointers, and
                  solitaires.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.inquiryCtaBtn}
                onPress={() => navigation.navigate("InquiryTab")}
              >
                <FileText size={16} color="#ffffff" />
                <Text style={styles.inquiryCtaBtnText}>Submit Requirement</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* About Us Tab Content */
          <View style={styles.aboutWrapper}>
            <View style={styles.aboutCard}>
              <Text style={styles.sectionOverline}>SURAT DIAMOND BOURSE LEGACY</Text>
              <Text style={styles.aboutMainTitle}>About Maa Diamond</Text>

              <Text style={styles.aboutParagraph}>
                <Text style={styles.bold}>Maa Diamond</Text> is a trusted name in the world of fine
                diamonds, specializing in precision manufacturing and global diamond trading. Built
                on integrity, master craftsmanship, and technological innovation, we deliver
                diamonds meeting the highest international standards of brilliance, beauty, and
                value.
              </Text>

              <Text style={styles.aboutParagraph}>
                From rough kimberlite crystal sourcing to skilled laser planning, 57-facet blocking,
                high-precision polishing, optical grading, and accredited certification (GIA &amp;
                IGI), every step is executed with microscopic precision at our Surat manufacturing
                facility.
              </Text>

              <Text style={styles.aboutParagraph}>
                Led by experienced directors <Text style={styles.bold}>Hardik Sorathiya</Text> and{" "}
                <Text style={styles.bold}>Sanket Sorathiya</Text>, we supply wholesale diamond
                parcels and single investment stones to jewelers across India, Antwerp, Dubai, and
                Hong Kong.
              </Text>
            </View>

            {/* Leadership Block */}
            <View style={styles.leadershipCard}>
              <Text style={styles.sectionOverline}>EXECUTIVE DIRECTORS</Text>
              <Text style={styles.aboutMainTitle}>Leadership &amp; Trade Desk</Text>

              <View style={styles.directorRow}>
                <View style={styles.directorAvatar}>
                  <Text style={styles.avatarLetter}>H</Text>
                </View>
                <View style={styles.directorMeta}>
                  <Text style={styles.directorName}>Hardik Sorathiya</Text>
                  <Text style={styles.directorRole}>Founder &amp; Managing Director</Text>
                  <Text style={styles.directorPhone}>+91 90333 20326</Text>
                </View>
                <TouchableOpacity
                  style={styles.directorCallBtn}
                  onPress={() => openCall("+919033320326")}
                >
                  <Phone size={15} color="#059669" />
                </TouchableOpacity>
              </View>

              <View style={styles.directorDivider} />

              <View style={styles.directorRow}>
                <View style={styles.directorAvatar}>
                  <Text style={styles.avatarLetter}>S</Text>
                </View>
                <View style={styles.directorMeta}>
                  <Text style={styles.directorName}>Sanket Sorathiya</Text>
                  <Text style={styles.directorRole}>Director - International Trade</Text>
                  <Text style={styles.directorPhone}>+91 80000 45391</Text>
                </View>
                <TouchableOpacity
                  style={styles.directorCallBtn}
                  onPress={() => openCall("+918000045391")}
                >
                  <Phone size={15} color="#059669" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Headquarters Card */}
            <View style={styles.headquartersCard}>
              <View style={styles.hqHeader}>
                <MapPin size={18} color="#d97706" />
                <Text style={styles.hqTitle}>Trading Headquarters</Text>
              </View>
              <Text style={styles.hqAddress}>
                217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat,
                395006
              </Text>
              <TouchableOpacity
                style={styles.hqMapBtn}
                onPress={() =>
                  Linking.openURL(
                    "https://maps.google.com/?q=Akshar+Diamond+Market+Mangadh+Chowk+Mini+Bazaar+Varachha+Surat"
                  )
                }
              >
                <Text style={styles.hqMapBtnText}>Open in Google Maps GPS</Text>
                <ChevronRight size={14} color="#d97706" />
              </TouchableOpacity>
            </View>
          </View>
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
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  segmentBtnActive: {
    backgroundColor: "#0f172a",
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  segmentTextActive: {
    color: "#ffffff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400e",
    letterSpacing: 0.5,
  },
  heroHeadline: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    lineHeight: 26,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 16,
  },
  heroActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    borderRadius: 10,
  },
  heroPrimaryBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0f172a",
  },
  heroWhatsAppBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  heroWhatsAppBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  sectionOverline: {
    fontSize: 10,
    fontWeight: "800",
    color: "#d97706",
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d97706",
  },
  shapeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  shapeCard: {
    width: (width - 42) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  shapeIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  shapeCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  shapeCardDesc: {
    fontSize: 10,
    color: "#64748b",
  },
  pillarsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  pillarsHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
  },
  pillarItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  pillarIconBoxAmber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  pillarIconBoxBlue: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  pillarIconBoxGreen: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
  },
  pillarTextCol: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  pillarDesc: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 16,
  },
  inquiryCtaCard: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  inquiryCtaContent: {
    marginBottom: 12,
  },
  inquiryCtaTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  inquiryCtaDesc: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 16,
  },
  inquiryCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#d97706",
    paddingVertical: 12,
    borderRadius: 10,
  },
  inquiryCtaBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  aboutWrapper: {
    gap: 16,
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  aboutMainTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 12,
  },
  aboutParagraph: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "700",
    color: "#0f172a",
  },
  leadershipCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  directorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  directorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f59e0b",
  },
  directorMeta: {
    flex: 1,
  },
  directorName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },
  directorRole: {
    fontSize: 11,
    color: "#64748b",
  },
  directorPhone: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d97706",
    marginTop: 1,
  },
  directorCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  directorDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 10,
  },
  headquartersCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  hqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  hqTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },
  hqAddress: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 12,
  },
  hqMapBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  hqMapBtnText: {
    fontSize: 11,
    fontWeight: "700",
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
  authPromoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  authPromoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fffbeb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginBottom: 8,
  },
  authPromoBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#d97706",
    letterSpacing: 0.5,
  },
  authPromoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  authPromoDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 12,
  },
  authBtnRow: {
    flexDirection: "row",
    gap: 10,
  },
  authSignInBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  authSignInBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  authSignUpBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    paddingVertical: 10,
    borderRadius: 10,
  },
  authSignUpBtnText: {
    color: "#b45309",
    fontSize: 12,
    fontWeight: "700",
  },
  authLoggedInContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authPromoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  authAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  authAvatarSmallText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  authPromoInfo: {
    flex: 1,
  },
  authPromoUser: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
  authPromoRole: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  authAccountBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  authAccountBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  authLoggedOutContent: {},
});
