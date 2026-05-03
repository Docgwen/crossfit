import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, BackHandler,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { Card, Lbl, Chip, MiniBar } from '../ui';
import { useApp } from '../AppContext';
import { PR_EXERCISES, PR_UNITS, RM_OPTIONS } from '../sampleData';

const MONTHS = ['S', 'O', 'N', 'D', 'J', 'F', 'A'];
const CAT_LABELS = [
  { id: 'halte', label: 'Haltéro' },
  { id: 'gymn', label: 'Gymn.' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'bench', label: 'Benchmark' },
];

// ─── PR List View ───────────────────────────────────────────
function PRListView({ navigation, onNewPR }) {
  const insets = useSafeAreaInsets();
  const { prs } = useApp();
  const [cat, setCat] = useState('halte');
  const [expanded, setExpanded] = useState(null);

  const filtered = prs.filter(p => p.cat === cat);

  const handleCat = (c) => { setCat(c); setExpanded(null); };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg0 }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Lbl>RECORDS PERSONNELS</Lbl>
            <Text style={styles.screenTitle}>Mes PR</Text>
          </View>
          <TouchableOpacity onPress={onNewPR} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          style={{ marginTop: 12 }}
        >
          {CAT_LABELS.map(c => (
            <Chip key={c.id} label={c.label} active={cat === c.id} onPress={() => handleCat(c.id)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, gap: 8, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((p, i) => (
          <View key={p.id || i} style={{ borderRadius: T.cardRadius, overflow: 'hidden' }}>
            <TouchableOpacity
              onPress={() => setExpanded(expanded === p.id ? null : p.id)}
              style={styles.prRow}
            >
              <View style={styles.prAccent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.prName}>{p.name}</Text>
                <Text style={styles.prDate}>{p.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.prValue}>{p.value} <Text style={styles.prUnit}>{p.unit}</Text></Text>
                <Text style={styles.prTrend}>▲ {p.trend}</Text>
              </View>
              <Text style={[styles.expandChevron, { transform: [{ rotate: expanded === p.id ? '180deg' : '0deg' }] }]}>▾</Text>
            </TouchableOpacity>
            {expanded === p.id && p.history && (
              <View style={styles.prExpanded}>
                <Lbl style={{ marginBottom: 10 }}>ÉVOLUTION — {p.history.length} MOIS</Lbl>
                <MiniBar
                  data={p.history.map((v, j) => ({ v, l: MONTHS[j] || '' }))}
                  height={72}
                />
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

// ─── New PR View ─────────────────────────────────────────────
function NewPRView({ onBack, onSaved }) {
  const insets = useSafeAreaInsets();
  const { addPR } = useApp();
  const [cat, setCat] = useState('halte');
  const [exercise, setExercise] = useState('Clean & Jerk');
  const [custom, setCustom] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [rmType, setRmType] = useState('1RM');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kg');
  const [prevPR, setPrevPR] = useState('');
  const [date, setDate] = useState('03/05/2026');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const exercises = PR_EXERCISES[cat];
  const handleCat = (c) => {
    setCat(c);
    setExercise(PR_EXERCISES[c][0]);
    setIsCustom(false);
    setUnit(PR_UNITS[c] === 'kg' ? 'kg' : PR_UNITS[c] === 'reps' ? 'reps' : 'min:sec');
  };

  const unitOptions = cat === 'halte' ? ['kg', 'lbs'] : cat === 'gymn' ? ['reps'] : ['min:sec', 'sec'];

  const numVal = Number(value.replace(',', '.'));
  const numPrev = Number(prevPR.replace(',', '.'));
  const isPR = value && prevPR && (cat === 'halte' || cat === 'gymn') && numVal > numPrev;

  const delta = value && prevPR
    ? ((numVal >= numPrev ? '+' : '') + (numVal - numPrev).toFixed(1).replace('.0', ''))
    : null;

  const handleSave = async () => {
    const name = isCustom ? custom : exercise;
    if (!name) return;
    await addPR({
      cat,
      name,
      type: rmType,
      value,
      unit,
      date,
      notes,
      history: [],
      trend: delta ? `${delta} ${cat === 'halte' ? 'kg' : ''}`.trim() : '',
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onSaved(); }, 1400);
  };

  const inputStyle = styles.input;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg0 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 22, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View>
          <Lbl>RECORDS PERSONNELS</Lbl>
          <Text style={[styles.screenTitle, { fontSize: 24 }]}>Nouveau PR</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 32, gap: 14 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Catégorie */}
        <View style={{ gap: 8 }}>
          <Lbl>CATÉGORIE</Lbl>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {CAT_LABELS.map(c => (
              <Chip key={c.id} label={c.label} active={cat === c.id} onPress={() => handleCat(c.id)} />
            ))}
          </View>
        </View>

        {/* Exercice */}
        <View style={{ gap: 8 }}>
          <Lbl>EXERCICE</Lbl>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {exercises.map(ex => (
              <Chip
                key={ex}
                label={ex}
                active={!isCustom && exercise === ex}
                onPress={() => { setExercise(ex); setIsCustom(false); }}
              />
            ))}
            <Chip label="Autre…" active={isCustom} onPress={() => setIsCustom(true)} />
          </View>
          {isCustom && (
            <TextInput
              value={custom}
              onChangeText={setCustom}
              placeholder="Nom de l'exercice…"
              style={inputStyle}
              placeholderTextColor={T.textMuted}
            />
          )}
        </View>

        {/* Type */}
        <View style={{ gap: 8 }}>
          <Lbl>TYPE</Lbl>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {RM_OPTIONS.map(r => (
              <Chip key={r} label={r} active={rmType === r} onPress={() => setRmType(r)} />
            ))}
          </View>
        </View>

        {/* Valeur */}
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Lbl>NOUVELLE VALEUR</Lbl>
              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={cat === 'halte' ? 'ex: 107.5' : cat === 'gymn' ? 'ex: 34' : 'ex: 3:45'}
                keyboardType={cat === 'halte' || cat === 'gymn' ? 'decimal-pad' : 'default'}
                style={[inputStyle, {
                  fontSize: 28,
                  fontFamily: 'DMSans_700Bold',
                  color: isPR ? T.accentColor : T.textPrimary,
                  paddingVertical: 10,
                  textAlign: 'center',
                }]}
                placeholderTextColor={T.textMuted}
              />
            </View>
            <View style={{ width: 72, gap: 4 }}>
              <Lbl>UNITÉ</Lbl>
              <View style={{ gap: 4 }}>
                {unitOptions.map(u => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setUnit(u)}
                    style={[styles.unitBtn, { backgroundColor: unit === u ? T.accentColor : T.bg3 }]}
                  >
                    <Text style={{
                      fontSize: 13,
                      fontFamily: 'DMMono_400Regular',
                      color: unit === u ? T.bg0 : T.textSecondary,
                    }}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Lbl>PR PRÉCÉDENT</Lbl>
              <TextInput
                value={prevPR}
                onChangeText={setPrevPR}
                placeholder="ex: 100"
                keyboardType={cat === 'halte' || cat === 'gymn' ? 'decimal-pad' : 'default'}
                style={[inputStyle, { fontSize: 16 }]}
                placeholderTextColor={T.textMuted}
              />
            </View>
            {value && prevPR && (
              <View style={{ width: 80, gap: 4 }}>
                <Lbl>PROGRESSION</Lbl>
                <View style={[styles.deltaBox, { backgroundColor: T.bg3 }]}>
                  <Text style={{ fontSize: 16, fontFamily: 'DMSans_700Bold', color: isPR ? '#5abf7a' : '#e03050' }}>
                    {delta}{cat === 'halte' ? ' kg' : cat === 'gymn' ? '' : ''}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {isPR && (
            <View style={styles.prBadge}>
              <Text style={{ fontSize: 22 }}>🏆</Text>
              <View>
                <Text style={{ fontSize: 14, fontFamily: 'DMSans_700Bold', color: T.accentColor }}>Nouveau PR !</Text>
                <Text style={{ fontSize: 12, fontFamily: 'DMSans_400Regular', color: T.textMuted }}>Record personnel battu</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Date */}
        <View style={{ gap: 4 }}>
          <Lbl>DATE</Lbl>
          <TextInput
            value={date}
            onChangeText={setDate}
            style={inputStyle}
            placeholderTextColor={T.textMuted}
          />
        </View>

        {/* Notes */}
        <View style={{ gap: 4 }}>
          <Lbl>NOTES</Lbl>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Conditions, sensations…"
            style={[inputStyle, { height: 56, textAlignVertical: 'top', paddingTop: 10 }]}
            placeholderTextColor={T.textMuted}
            multiline
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, { backgroundColor: saved ? '#5abf7a' : T.accentColor }]}
        >
          <Text style={styles.saveBtnText}>
            {saved ? '🏆 PR enregistré !' : 'Enregistrer le PR'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Combined PR Screen ──────────────────────────────────────
export default function PRScreen({ navigation }) {
  const [showNewPR, setShowNewPR] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBack = () => {
        if (showNewPR) { setShowNewPR(false); return true; }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBack);
    }, [showNewPR])
  );

  if (showNewPR) {
    return (
      <NewPRView
        onBack={() => setShowNewPR(false)}
        onSaved={() => setShowNewPR(false)}
      />
    );
  }

  return <PRListView navigation={navigation} onNewPR={() => setShowNewPR(true)} />;
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
    lineHeight: 32,
    marginTop: 4,
    marginBottom: 0,
  },
  addBtn: {
    backgroundColor: T.accentColor,
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 24,
    color: T.bg0,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 28,
  },
  prRow: {
    backgroundColor: T.bg2,
    padding: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prAccent: {
    width: 3,
    height: 34,
    borderRadius: 2,
    backgroundColor: T.accentColor,
  },
  prName: {
    fontSize: 17,
    fontFamily: 'DMSans_700Bold',
    color: T.textPrimary,
  },
  prDate: {
    fontSize: 11,
    fontFamily: 'DMMono_400Regular',
    color: T.textMuted,
    marginTop: 2,
  },
  prValue: {
    fontSize: 22,
    fontFamily: 'DMSans_700Bold',
    color: T.accentColor,
  },
  prUnit: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: T.textSecondary,
  },
  prTrend: {
    fontSize: 11,
    fontFamily: 'DMSans_400Regular',
    color: '#5abf7a',
    marginTop: 1,
  },
  expandChevron: {
    color: T.textMuted,
    fontSize: 13,
    marginLeft: 2,
    fontFamily: 'DMSans_400Regular',
  },
  prExpanded: {
    backgroundColor: T.bg1,
    padding: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: T.bg3,
  },
  input: {
    backgroundColor: T.bg3,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: T.textPrimary,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },
  unitBtn: {
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  deltaBox: {
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  prBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(184,255,87,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(184,255,87,0.2)',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 14,
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
  saveBtn: {
    height: 52,
    borderRadius: T.cardRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: T.bg0,
    fontSize: 17,
    fontFamily: 'DMSans_700Bold',
  },
});
