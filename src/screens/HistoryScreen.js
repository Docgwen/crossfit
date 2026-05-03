import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, ZONE_COLORS, ZONE_LABELS } from '../theme';
import { Card, Lbl, Chip, GarminCard, DropInBadge } from '../ui';
import { useApp } from '../AppContext';
import { APRIL_SESSIONS } from '../sampleData';

const CAL_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const FILTERS = ['Tous', 'Mai 26', 'Avr 26', 'Mar 26'];

function MiniCalendar({ onSelectDay, selectedDay }) {
  const firstDow = 2;
  const daysInMonth = 30;
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={styles.calCard}>
      <View style={styles.calHeader}>
        <Text style={styles.calMonth}>Avril 2026</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity style={styles.calNav}><Text style={styles.calNavText}>‹</Text></TouchableOpacity>
          <TouchableOpacity style={styles.calNav}><Text style={styles.calNavText}>›</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.calDaysRow}>
        {CAL_DAYS.map((d, i) => (
          <Text key={i} style={styles.calDayLabel}>{d}</Text>
        ))}
      </View>
      <View style={styles.calGrid}>
        {cells.map((d, i) => {
          if (!d) return <View key={i} style={styles.calCell} />;
          const hasSession = !!APRIL_SESSIONS[d];
          const isSelected = selectedDay === d;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onSelectDay(hasSession ? d : null)}
              disabled={!hasSession}
              style={[
                styles.calCell,
                isSelected && { backgroundColor: T.accentColor },
                hasSession && !isSelected && { backgroundColor: T.bg3 },
              ]}
            >
              <Text style={[
                styles.calDayNum,
                isSelected && { color: T.bg0, fontFamily: 'DMSans_700Bold' },
                hasSession && !isSelected && { color: T.textPrimary, fontFamily: 'DMSans_700Bold' },
                !hasSession && { color: T.textMuted },
              ]}>
                {d}
              </Text>
              {hasSession && !isSelected && (
                <View style={styles.calDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function WodDetailView({ wod, onBack }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.detailHeader, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View>
          <Lbl>{wod.type}</Lbl>
          <Text style={styles.detailTitle}>{wod.name}</Text>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.detailScroll}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.resultCard}>
          <View>
            <Lbl>RÉSULTAT</Lbl>
            <Text style={styles.resultValue}>{wod.result}</Text>
          </View>
          <View style={styles.scaleTag}>
            <Text style={styles.scaleTagText}>{wod.scale}</Text>
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Lbl>BOX</Lbl>
              <Text style={styles.detailBoxName}>{wod.box}</Text>
              {wod.city ? <Text style={styles.detailCity}>{wod.city}</Text> : null}
            </View>
            {wod.drop && <DropInBadge />}
          </View>
          <View style={styles.divider} />
          <View>
            <Lbl>COACH</Lbl>
            <Text style={styles.detailCoach}>👤 {wod.coach}</Text>
          </View>
        </Card>

        {wod.movements && wod.movements.length > 0 && wod.movements[0].name ? (
          <Card style={{ gap: 8 }}>
            <Lbl>MOUVEMENTS</Lbl>
            {wod.movements.map((m, i) => (
              <View key={i} style={styles.mvtDetailRow}>
                <View style={styles.mvtDetailDot} />
                <Text style={styles.mvtDetailName}>{m.name}</Text>
                <Text style={styles.mvtDetailInfo}>{m.detail}</Text>
              </View>
            ))}
          </Card>
        ) : null}

        <Card>
          <Lbl>DATE</Lbl>
          <Text style={styles.detailDate}>{wod.date}</Text>
        </Card>

        {wod.notes ? (
          <Card>
            <Lbl>NOTES</Lbl>
            <Text style={styles.detailNotes}>{wod.notes}</Text>
          </Card>
        ) : null}

        {wod.garmin && (
          <GarminCard
            cal={wod.garmin.cal}
            fcMax={wod.garmin.fcMax}
            z2={wod.garmin.z2}
            z3={wod.garmin.z3}
            z4={wod.garmin.z4}
            z5={wod.garmin.z5}
          />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

export default function HistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { wods } = useApp();
  const [viewMode, setViewMode] = useState('liste');
  const [filter, setFilter] = useState('Tous');
  const [selected, setSelected] = useState(null);
  const [calDay, setCalDay] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBack = () => {
        if (selected) { setSelected(null); return true; }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBack);
    }, [selected])
  );

  const filtered = filter === 'Avr 26'
    ? wods.filter(w => w.date && w.date.includes('Avr'))
    : filter === 'Mar 26'
    ? wods.filter(w => w.date && w.date.includes('Mar'))
    : filter === 'Mai 26'
    ? wods.filter(w => w.date && w.date.includes('Mai'))
    : wods;

  const calSession = calDay
    ? wods.find(w => w.date && w.date.includes(`${calDay} Avr`))
    : null;

  if (selected) {
    return <WodDetailView wod={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg0 }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Lbl>SÉANCES</Lbl>
            <Text style={styles.screenTitle}>Historique</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                onPress={() => setViewMode('liste')}
                style={[styles.viewToggleBtn, viewMode === 'liste' && styles.viewToggleBtnActive]}
              >
                <Text style={{ color: viewMode === 'liste' ? T.textPrimary : T.textMuted, fontFamily: 'DMMono_400Regular', fontSize: 14 }}>≡</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('calendrier')}
                style={[styles.viewToggleBtn, viewMode === 'calendrier' && styles.viewToggleBtnActive]}
              >
                <Text style={{ color: viewMode === 'calendrier' ? T.textPrimary : T.textMuted, fontFamily: 'DMMono_400Regular', fontSize: 12 }}>▦</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('WOD')}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {viewMode === 'liste' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 12, gap: 8 }}
            style={{ flexShrink: 0 }}
          >
            {FILTERS.map(m => (
              <Chip key={m} label={m} active={filter === m} onPress={() => setFilter(m)} />
            ))}
          </ScrollView>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 22, gap: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {filtered.map(w => (
              <TouchableOpacity key={w.id} onPress={() => setSelected(w)} style={styles.wodCard}>
                <View style={styles.wodCardTop}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={styles.wodType}>{w.type}</Text>
                    {w.drop && (
                      <View style={styles.dropInline}>
                        <Text style={styles.dropInlineText}>✈ DROP-IN</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.wodDate}>{w.date}</Text>
                </View>
                <View style={styles.wodCardMid}>
                  <Text style={styles.wodName}>{w.name}</Text>
                  <Text style={styles.wodResult}>{w.result}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.wodMeta}>📍 {w.box}{w.coach ? ` · 👤 ${w.coach}` : ''}</Text>
                  {w.garmin && (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Text style={styles.garminInline}>{w.garmin.cal} kcal</Text>
                      <Text style={[styles.garminInline, { color: '#e03050' }]}>♥ {w.garmin.fcMax}</Text>
                      <Text style={[styles.garminInline, { color: '#4abf7a' }]}>Z2 {w.garmin.z2}%</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 16 }} />
          </ScrollView>
        </>
      )}

      {viewMode === 'calendrier' && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 22, gap: 12, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <MiniCalendar onSelectDay={setCalDay} selectedDay={calDay} />
          {calDay && calSession && (
            <TouchableOpacity onPress={() => setSelected(calSession)} style={styles.calSessionCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.wodType}>{calSession.type}</Text>
                <Text style={styles.wodDate}>{calSession.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                <Text style={styles.wodName}>{calSession.name}</Text>
                <Text style={styles.wodResult}>{calSession.result}</Text>
              </View>
              <Text style={[styles.wodMeta, { marginTop: 6 }]}>Voir le détail →</Text>
            </TouchableOpacity>
          )}
          {calDay && !calSession && (
            <View style={styles.restCard}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>😴</Text>
              <Text style={{ fontSize: 14, color: T.textMuted, fontFamily: 'DMSans_400Regular' }}>Repos ce jour-là</Text>
            </View>
          )}
          {!calDay && (
            <View style={styles.restCard}>
              <Text style={{ fontSize: 13, color: T.textMuted, fontFamily: 'DMSans_400Regular', textAlign: 'center' }}>
                Sélectionne un jour pour voir la séance
              </Text>
              <Text style={{ fontSize: 11, color: T.textMuted, fontFamily: 'DMMono_400Regular', marginTop: 4, textAlign: 'center' }}>
                Les points verts = séances enregistrées
              </Text>
            </View>
          )}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    lineHeight: 32,
    marginTop: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: T.bg2,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  viewToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewToggleBtnActive: {
    backgroundColor: T.bg3,
  },
  addBtn: {
    backgroundColor: T.accentColor,
    borderRadius: 12,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 22,
    color: T.bg0,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 26,
  },
  wodCard: {
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 14,
    gap: 6,
  },
  wodCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wodCardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  wodType: {
    fontSize: 10,
    fontFamily: 'DMMono_400Regular',
    color: T.accentColor,
    letterSpacing: 1,
  },
  wodDate: {
    fontSize: 11,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
  },
  wodName: {
    fontSize: 20,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
  },
  wodResult: {
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
  },
  wodMeta: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
  },
  garminInline: {
    fontSize: 11,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
  },
  dropInline: {
    backgroundColor: 'rgba(240,160,80,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dropInlineText: {
    fontSize: 10,
    fontFamily: 'DMMono_400Regular',
    color: T.dropColor,
  },
  calCard: {
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 14,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calMonth: {
    fontSize: 14,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
  },
  calNav: { padding: 4 },
  calNavText: {
    fontSize: 16,
    color: T.textMuted,
    fontFamily: 'DMSans_400Regular',
  },
  calDaysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
    paddingVertical: 2,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  calCell: {
    width: `${100 / 7 - 1}%`,
    aspectRatio: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calDayNum: {
    fontSize: 11,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
  },
  calDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.accentColor,
  },
  calSessionCard: {
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 14,
    borderWidth: 1,
    borderColor: `${T.accentColor}33`,
    gap: 4,
  },
  restCard: {
    backgroundColor: T.bg2,
    borderRadius: T.cardRadius,
    padding: 16,
    alignItems: 'center',
  },
  // Detail styles
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  backBtn: {
    backgroundColor: T.bg2,
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: T.textSecondary,
    fontSize: 18,
    fontFamily: 'DMSans_400Regular',
  },
  detailTitle: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    lineHeight: 30,
  },
  detailScroll: {
    paddingHorizontal: 22,
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 36,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
    lineHeight: 42,
    marginTop: 4,
  },
  scaleTag: {
    backgroundColor: T.bg3,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  scaleTagText: {
    fontSize: 15,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
  },
  detailBoxName: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    marginTop: 3,
  },
  detailCity: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: T.textMuted,
    marginTop: 1,
  },
  detailCoach: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    marginTop: 3,
  },
  detailDate: {
    fontSize: 17,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    marginTop: 4,
  },
  detailNotes: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: T.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: T.bg3,
  },
  mvtDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  mvtDetailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.accentColor,
  },
  mvtDetailName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    color: T.textPrimary,
  },
  mvtDetailInfo: {
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    color: T.textSecondary,
  },
});
