import React, { useState, useEffect } from 'react';

const PotenzFussballSpiel = () => {
  const [ballPosition, setBallPosition] = useState(3); // 0 = Mein Tor, 6 = Gegnertor, 3 = Mitte
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentTask, setCurrentTask] = useState(null);
  const [basisInput, setBasisInput] = useState('');
  const [exponentInput, setExponentInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInfo, setGoalInfo] = useState({ scorer: '', newPlayerScore: 0, newOpponentScore: 0 });
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerResult, setAnswerResult] = useState({ isCorrect: false, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const positions = [
    'Mein Tor 🥅',
    'Meine Verteidigung',
    'Mein def. Mittelfeld',
    'Mittellinie',
    'Mein off. Mittelfeld',
    'Mein Sturm',
    'Gegnertor 🥅'
  ];

  const tasks = [
    // Multiplikation gleicher Basen - Einfach
    { question: 'a² · a³', correctBasis: 'a', correctExponent: '5', explanation: 'a² · a³ = a²⁺³ = a⁵' },
    { question: 'a³ · a⁵', correctBasis: 'a', correctExponent: '8', explanation: 'a³ · a⁵ = a³⁺⁵ = a⁸' },
    { question: 'x² · x⁴', correctBasis: 'x', correctExponent: '6', explanation: 'x² · x⁴ = x²⁺⁴ = x⁶' },
    { question: 'b¹ · b⁶', correctBasis: 'b', correctExponent: '7', explanation: 'b¹ · b⁶ = b¹⁺⁶ = b⁷' },
    { question: 'y⁴ · y²', correctBasis: 'y', correctExponent: '6', explanation: 'y⁴ · y² = y⁴⁺² = y⁶' },
    { question: 'z³ · z³', correctBasis: 'z', correctExponent: '6', explanation: 'z³ · z³ = z³⁺³ = z⁶' },
    { question: 't⁵ · t¹', correctBasis: 't', correctExponent: '6', explanation: 't⁵ · t¹ = t⁵⁺¹ = t⁶' },
    { question: 'm² · m⁵', correctBasis: 'm', correctExponent: '7', explanation: 'm² · m⁵ = m²⁺⁵ = m⁷' },
    { question: 'p⁷ · p²', correctBasis: 'p', correctExponent: '9', explanation: 'p⁷ · p² = p⁷⁺² = p⁹' },
    { question: 'k⁴ · k⁴', correctBasis: 'k', correctExponent: '8', explanation: 'k⁴ · k⁴ = k⁴⁺⁴ = k⁸' },

    // Multiplikation gleicher Basen - Mit negativen Exponenten
    { question: 'b⁻² · b⁷', correctBasis: 'b', correctExponent: '5', explanation: 'b⁻² · b⁷ = b⁻²⁺⁷ = b⁵' },
    { question: 'x⁻³ · x⁵', correctBasis: 'x', correctExponent: '2', explanation: 'x⁻³ · x⁵ = x⁻³⁺⁵ = x²' },
    { question: 'a⁻⁴ · a⁶', correctBasis: 'a', correctExponent: '2', explanation: 'a⁻⁴ · a⁶ = a⁻⁴⁺⁶ = a²' },
    { question: 'y⁻¹ · y⁻³', correctBasis: 'y', correctExponent: '-4', explanation: 'y⁻¹ · y⁻³ = y⁻¹⁺⁽⁻³⁾ = y⁻⁴' },
    { question: 'z⁻⁵ · z⁸', correctBasis: 'z', correctExponent: '3', explanation: 'z⁻⁵ · z⁸ = z⁻⁵⁺⁸ = z³' },
    { question: 't⁻² · t⁻¹', correctBasis: 't', correctExponent: '-3', explanation: 't⁻² · t⁻¹ = t⁻²⁺⁽⁻¹⁾ = t⁻³' },
    { question: 'm⁻⁶ · m⁹', correctBasis: 'm', correctExponent: '3', explanation: 'm⁻⁶ · m⁹ = m⁻⁶⁺⁹ = m³' },
    { question: 'p⁻³ · p⁻²', correctBasis: 'p', correctExponent: '-5', explanation: 'p⁻³ · p⁻² = p⁻³⁺⁽⁻²⁾ = p⁻⁵' },

    // Multiplikation gleicher Basen - Mit Brüchen
    { question: 'a^(1/2) · a^(3/2)', correctBasis: 'a', correctExponent: '2', explanation: 'a^(1/2) · a^(3/2) = a^(1/2+3/2) = a²' },
    { question: 'x^(2/3) · x^(1/3)', correctBasis: 'x', correctExponent: '1', explanation: 'x^(2/3) · x^(1/3) = x^(2/3+1/3) = x¹' },
    { question: 'b^(3/4) · b^(1/4)', correctBasis: 'b', correctExponent: '1', explanation: 'b^(3/4) · b^(1/4) = b^(3/4+1/4) = b¹' },
    { question: 'y^(1/3) · y^(2/3)', correctBasis: 'y', correctExponent: '1', explanation: 'y^(1/3) · y^(2/3) = y^(1/3+2/3) = y¹' },

    // Division gleicher Basen - Einfach
    { question: 'y⁸ ÷ y³', correctBasis: 'y', correctExponent: '5', explanation: 'y⁸ ÷ y³ = y⁸⁻³ = y⁵' },
    { question: 'x⁹ ÷ x⁴', correctBasis: 'x', correctExponent: '5', explanation: 'x⁹ ÷ x⁴ = x⁹⁻⁴ = x⁵' },
    { question: 'a⁷ ÷ a²', correctBasis: 'a', correctExponent: '5', explanation: 'a⁷ ÷ a² = a⁷⁻² = a⁵' },
    { question: 'b⁶ ÷ b¹', correctBasis: 'b', correctExponent: '5', explanation: 'b⁶ ÷ b¹ = b⁶⁻¹ = b⁵' },
    { question: 'z⁵ ÷ z⁵', correctBasis: 'z', correctExponent: '0', explanation: 'z⁵ ÷ z⁵ = z⁵⁻⁵ = z⁰' },
    { question: 't⁸ ÷ t³', correctBasis: 't', correctExponent: '5', explanation: 't⁸ ÷ t³ = t⁸⁻³ = t⁵' },
    { question: 'm⁶ ÷ m²', correctBasis: 'm', correctExponent: '4', explanation: 'm⁶ ÷ m² = m⁶⁻² = m⁴' },
    { question: 'p¹⁰ ÷ p⁷', correctBasis: 'p', correctExponent: '3', explanation: 'p¹⁰ ÷ p⁷ = p¹⁰⁻⁷ = p³' },

    // Division gleicher Basen - Mit negativen Exponenten
    { question: 'x⁶ ÷ x⁻²', correctBasis: 'x', correctExponent: '8', explanation: 'x⁶ ÷ x⁻² = x⁶⁻⁽⁻²⁾ = x⁸' },
    { question: 'a⁴ ÷ a⁷', correctBasis: 'a', correctExponent: '-3', explanation: 'a⁴ ÷ a⁷ = a⁴⁻⁷ = a⁻³' },
    { question: 'b⁻³ ÷ b⁻⁵', correctBasis: 'b', correctExponent: '2', explanation: 'b⁻³ ÷ b⁻⁵ = b⁻³⁻⁽⁻⁵⁾ = b²' },
    { question: 'y⁻¹ ÷ y³', correctBasis: 'y', correctExponent: '-4', explanation: 'y⁻¹ ÷ y³ = y⁻¹⁻³ = y⁻⁴' },
    { question: 'z² ÷ z⁻³', correctBasis: 'z', correctExponent: '5', explanation: 'z² ÷ z⁻³ = z²⁻⁽⁻³⁾ = z⁵' },
    { question: 't⁻² ÷ t⁻⁶', correctBasis: 't', correctExponent: '4', explanation: 't⁻² ÷ t⁻⁶ = t⁻²⁻⁽⁻⁶⁾ = t⁴' },

    // Division gleicher Basen - Mit Brüchen
    { question: 'a^(5/2) ÷ a^(1/2)', correctBasis: 'a', correctExponent: '2', explanation: 'a^(5/2) ÷ a^(1/2) = a^(5/2-1/2) = a²' },
    { question: 'x^(3/4) ÷ x^(1/4)', correctBasis: 'x', correctExponent: '1/2', explanation: 'x^(3/4) ÷ x^(1/4) = x^(3/4-1/4) = x^(1/2)' },

    // Multiplikation gleicher Exponenten (Klammern essentiell!)
    { question: 'a³ · b³', correctBasis: '(ab)', correctExponent: '3', explanation: 'a³ · b³ = (ab)³' },
    { question: 'x² · y²', correctBasis: '(xy)', correctExponent: '2', explanation: 'x² · y² = (xy)²' },
    { question: 'p⁴ · q⁴', correctBasis: '(pq)', correctExponent: '4', explanation: 'p⁴ · q⁴ = (pq)⁴' },
    { question: 'm⁵ · n⁵', correctBasis: '(mn)', correctExponent: '5', explanation: 'm⁵ · n⁵ = (mn)⁵' },
    { question: 'a¹ · b¹', correctBasis: '(ab)', correctExponent: '1', explanation: 'a¹ · b¹ = (ab)¹' },
    { question: 'x⁻² · y⁻²', correctBasis: '(xy)', correctExponent: '-2', explanation: 'x⁻² · y⁻² = (xy)⁻²' },
    { question: 'u⁻¹ · v⁻¹', correctBasis: '(uv)', correctExponent: '-1', explanation: 'u⁻¹ · v⁻¹ = (uv)⁻¹' },
    { question: 's⁻³ · t⁻³', correctBasis: '(st)', correctExponent: '-3', explanation: 's⁻³ · t⁻³ = (st)⁻³' },
    { question: 'a^(1/2) · b^(1/2)', correctBasis: '(ab)', correctExponent: '1/2', explanation: 'a^(1/2) · b^(1/2) = (ab)^(1/2)' },
    { question: 'x^(2/3) · y^(2/3)', correctBasis: '(xy)', correctExponent: '2/3', explanation: 'x^(2/3) · y^(2/3) = (xy)^(2/3)' },

    // Division gleicher Exponenten (Klammern sind hier essentiell!)
    { question: 'x⁴ ÷ y⁴', correctBasis: '(x/y)', correctExponent: '4', explanation: 'x⁴ ÷ y⁴ = (x/y)⁴' },
    { question: 'a² ÷ b²', correctBasis: '(a/b)', correctExponent: '2', explanation: 'a² ÷ b² = (a/b)²' },
    { question: 'p³ ÷ q³', correctBasis: '(p/q)', correctExponent: '3', explanation: 'p³ ÷ q³ = (p/q)³' },
    { question: 'm⁵ ÷ n⁵', correctBasis: '(m/n)', correctExponent: '5', explanation: 'm⁵ ÷ n⁵ = (m/n)⁵' },
    { question: 'a⁻³ ÷ b⁻³', correctBasis: '(a/b)', correctExponent: '-3', explanation: 'a⁻³ ÷ b⁻³ = (a/b)⁻³' },
    { question: 'x⁻¹ ÷ y⁻¹', correctBasis: '(x/y)', correctExponent: '-1', explanation: 'x⁻¹ ÷ y⁻¹ = (x/y)⁻¹' },
    { question: 'u⁻² ÷ v⁻²', correctBasis: '(u/v)', correctExponent: '-2', explanation: 'u⁻² ÷ v⁻² = (u/v)⁻²' },
    { question: 'a^(1/3) ÷ b^(1/3)', correctBasis: '(a/b)', correctExponent: '1/3', explanation: 'a^(1/3) ÷ b^(1/3) = (a/b)^(1/3)' },

    // Potenz einer Potenz - Einfach
    { question: '(a²)³', correctBasis: 'a', correctExponent: '6', explanation: '(a²)³ = a²·³ = a⁶' },
    { question: '(x³)²', correctBasis: 'x', correctExponent: '6', explanation: '(x³)² = x³·² = x⁶' },
    { question: '(b⁴)²', correctBasis: 'b', correctExponent: '8', explanation: '(b⁴)² = b⁴·² = b⁸' },
    { question: '(y²)⁴', correctBasis: 'y', correctExponent: '8', explanation: '(y²)⁴ = y²·⁴ = y⁸' },
    { question: '(z³)³', correctBasis: 'z', correctExponent: '9', explanation: '(z³)³ = z³·³ = z⁹' },
    { question: '(t¹)⁵', correctBasis: 't', correctExponent: '5', explanation: '(t¹)⁵ = t¹·⁵ = t⁵' },
    { question: '(m⁵)²', correctBasis: 'm', correctExponent: '10', explanation: '(m⁵)² = m⁵·² = m¹⁰' },

    // Potenz einer Potenz - Mit negativen Exponenten
    { question: '(x⁻¹)⁴', correctBasis: 'x', correctExponent: '-4', explanation: '(x⁻¹)⁴ = x⁻¹·⁴ = x⁻⁴' },
    { question: '(y³)⁻²', correctBasis: 'y', correctExponent: '-6', explanation: '(y³)⁻² = y³·⁽⁻²⁾ = y⁻⁶' },
    { question: '(a⁻²)³', correctBasis: 'a', correctExponent: '-6', explanation: '(a⁻²)³ = a⁻²·³ = a⁻⁶' },
    { question: '(b⁻³)⁻²', correctBasis: 'b', correctExponent: '6', explanation: '(b⁻³)⁻² = b⁻³·⁽⁻²⁾ = b⁶' },
    { question: '(z²)⁻³', correctBasis: 'z', correctExponent: '-6', explanation: '(z²)⁻³ = z²·⁽⁻³⁾ = z⁻⁶' },
    { question: '(t⁻¹)⁻⁴', correctBasis: 't', correctExponent: '4', explanation: '(t⁻¹)⁻⁴ = t⁻¹·⁽⁻⁴⁾ = t⁴' },

    // Potenz einer Potenz - Mit Brüchen
    { question: '(a^(1/2))²', correctBasis: 'a', correctExponent: '1', explanation: '(a^(1/2))² = a^(1/2·2) = a¹' },
    { question: '(x^(2/3))³', correctBasis: 'x', correctExponent: '2', explanation: '(x^(2/3))³ = x^(2/3·3) = x²' },
    { question: '(b^(3/4))⁴', correctBasis: 'b', correctExponent: '3', explanation: '(b^(3/4))⁴ = b^(3/4·4) = b³' },
    { question: '(y¹)^(1/2)', correctBasis: 'y', correctExponent: '1/2', explanation: '(y¹)^(1/2) = y^(1·1/2) = y^(1/2)' },

    // Gemischte komplexe Aufgaben (Klammern sind hier essentiell!)
    { question: '(ab)² · (ab)⁻¹', correctBasis: '(ab)', correctExponent: '1', explanation: '(ab)² · (ab)⁻¹ = (ab)²⁺⁽⁻¹⁾ = (ab)¹' },
    { question: '(x/y)³ ÷ (x/y)⁻¹', correctBasis: '(x/y)', correctExponent: '4', explanation: '(x/y)³ ÷ (x/y)⁻¹ = (x/y)³⁻⁽⁻¹⁾ = (x/y)⁴' },
    { question: '(pq)⁻² · (pq)⁵', correctBasis: '(pq)', correctExponent: '3', explanation: '(pq)⁻² · (pq)⁵ = (pq)⁻²⁺⁵ = (pq)³' },
    { question: '(a/b)⁴ ÷ (a/b)²', correctBasis: '(a/b)', correctExponent: '2', explanation: '(a/b)⁴ ÷ (a/b)² = (a/b)⁴⁻² = (a/b)²' },
    { question: '(mn)⁻¹ · (mn)⁻³', correctBasis: '(mn)', correctExponent: '-4', explanation: '(mn)⁻¹ · (mn)⁻³ = (mn)⁻¹⁺⁽⁻³⁾ = (mn)⁻⁴' },
    { question: '(u/v)⁻² ÷ (u/v)⁻⁵', correctBasis: '(u/v)', correctExponent: '3', explanation: '(u/v)⁻² ÷ (u/v)⁻⁵ = (u/v)⁻²⁻⁽⁻⁵⁾ = (u/v)³' },
    { question: '(xy)¹ · (xy)⁰', correctBasis: '(xy)', correctExponent: '1', explanation: '(xy)¹ · (xy)⁰ = (xy)¹⁺⁰ = (xy)¹' },
    { question: '(a/b)⁰ · (a/b)³', correctBasis: '(a/b)', correctExponent: '3', explanation: '(a/b)⁰ · (a/b)³ = (a/b)⁰⁺³ = (a/b)³' },

    // Sehr komplexe Aufgaben
    { question: '(st)^(1/2) · (st)^(3/2)', correctBasis: '(st)', correctExponent: '2', explanation: '(st)^(1/2) · (st)^(3/2) = (st)^(1/2+3/2) = (st)²' },
    { question: '(a/b)^(2/3) ÷ (a/b)^(1/3)', correctBasis: '(a/b)', correctExponent: '1/3', explanation: '(a/b)^(2/3) ÷ (a/b)^(1/3) = (a/b)^(2/3-1/3) = (a/b)^(1/3)' },
    { question: '((xy)²)³', correctBasis: '(xy)', correctExponent: '6', explanation: '((xy)²)³ = (xy)²·³ = (xy)⁶' },
    { question: '((a/b)³)²', correctBasis: '(a/b)', correctExponent: '6', explanation: '((a/b)³)² = (a/b)³·² = (a/b)⁶' },
    { question: '((pq)⁻¹)⁻²', correctBasis: '(pq)', correctExponent: '2', explanation: '((pq)⁻¹)⁻² = (pq)⁻¹·⁽⁻²⁾ = (pq)²' },

    // Weitere Variationen
    { question: 'r³ · r⁰', correctBasis: 'r', correctExponent: '3', explanation: 'r³ · r⁰ = r³⁺⁰ = r³' },
    { question: 's⁰ · s⁷', correctBasis: 's', correctExponent: '7', explanation: 's⁰ · s⁷ = s⁰⁺⁷ = s⁷' },
    { question: 'w⁵ ÷ w⁰', correctBasis: 'w', correctExponent: '5', explanation: 'w⁵ ÷ w⁰ = w⁵⁻⁰ = w⁵' },
    { question: 'v⁰ ÷ v⁻³', correctBasis: 'v', correctExponent: '3', explanation: 'v⁰ ÷ v⁻³ = v⁰⁻⁽⁻³⁾ = v³' },

    // Mehr Drei-Buchstaben-Kombinationen (Klammern essentiell wegen Komplexität!)
    { question: '(abc)² · (def)²', correctBasis: '(abcdef)', correctExponent: '2', explanation: '(abc)² · (def)² = (abc·def)² = (abcdef)²' },
    { question: '(rst)³ ÷ (uvw)³', correctBasis: '(rst/uvw)', correctExponent: '3', explanation: '(rst)³ ÷ (uvw)³ = (rst/uvw)³' }
  ];

  const generateNewTask = () => {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    setCurrentTask(randomTask);
    setBasisInput('');
    setExponentInput('');
    setFeedback('');
    setShowFeedbackPopup(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    generateNewTask();
  }, []);

  const checkAnswer = () => {
    if (isProcessing || !currentTask || !basisInput.trim() || !exponentInput.trim()) {
      if (!basisInput.trim() || !exponentInput.trim()) {
        setAnswerResult({ isCorrect: false, message: '❌ Bitte fülle beide Felder aus!' });
        setShowAnswerModal(true);
      }
      return;
    }

    setIsProcessing(true);

    // Normalisiere die Eingabe: * als Multiplikationszeichen akzeptieren und Klammern behandeln
    let normalizedBasisInput = basisInput.trim().replace(/\*/g, '');
    let normalizedCorrectBasis = currentTask.correctBasis.replace(/\*/g, '');
    
    // Prüfe ob Klammern optional sind (nur bei einzelnen Variablen wie "a", "x", etc.)
    const isSingleVariable = /^[a-zA-Z]$/.test(normalizedCorrectBasis);
    
    if (isSingleVariable) {
      // Entferne Klammern für Vergleich bei einzelnen Variablen (a vs (a))
      normalizedBasisInput = normalizedBasisInput.replace(/[()]/g, '');
      normalizedCorrectBasis = normalizedCorrectBasis.replace(/[()]/g, '');
    }
    
    const isCorrect = 
      normalizedBasisInput === normalizedCorrectBasis && 
      exponentInput.trim() === currentTask.correctExponent;

    if (isCorrect) {
      setAnswerResult({ isCorrect: true, message: '✅ Richtig! Gut gemacht!' });
      setShowAnswerModal(true);
    } else {
      setAnswerResult({ isCorrect: false, message: `❌ Falsch! ${currentTask.explanation}` });
      setShowAnswerModal(true);
    }
  };

  const handleAnswerModalClose = (wasCorrect) => {
    setShowAnswerModal(false);
    setIsProcessing(false);
    
    // Erst Ball bewegen, dann neue Aufgabe generieren
    if (wasCorrect) {
      const newPosition = Math.min(ballPosition + 1, 6);
      setBallPosition(newPosition);
      
      if (newPosition === 6) {
        const newPlayerScore = playerScore + 1;
        setPlayerScore(newPlayerScore);
        setGoalInfo({ 
          scorer: 'Du', 
          newPlayerScore: newPlayerScore, 
          newOpponentScore: opponentScore 
        });
        setTimeout(() => setShowGoalModal(true), 1000); // Verzögerung für Ball-Animation
        
        if (newPlayerScore >= 3) {
          setGameOver(true);
          return;
        }
      }
    } else {
      const newPosition = Math.max(ballPosition - 1, 0);
      setBallPosition(newPosition);
      
      if (newPosition === 0) {
        const newOpponentScore = opponentScore + 1;
        setOpponentScore(newOpponentScore);
        setGoalInfo({ 
          scorer: 'Gegner', 
          newPlayerScore: playerScore, 
          newOpponentScore: newOpponentScore 
        });
        setTimeout(() => setShowGoalModal(true), 1000); // Verzögerung für Ball-Animation
        
        if (newOpponentScore >= 3) {
          setGameOver(true);
          return;
        }
      }
    }
    
    // Neue Aufgabe nach kurzer Verzögerung
    setTimeout(() => {
      generateNewTask();
    }, 500);
  };

  const handleGoalModalClose = () => {
    setShowGoalModal(false);
    setBallPosition(3);
    
    // Prüfe, ob das Spiel zu Ende ist
    if (goalInfo.newPlayerScore >= 3) {
      setGameOver(true);
      setFeedback('🎉 Herzlichen Glückwunsch! Du hast gewonnen!');
    } else if (goalInfo.newOpponentScore >= 3) {
      setGameOver(true);
      setFeedback('😞 Schade! Der Gegner hat gewonnen. Versuch es nochmal!');
    } else {
      generateNewTask();
    }
  };

  const resetGame = () => {
    setBallPosition(3);
    setPlayerScore(0);
    setOpponentScore(0);
    setGameOver(false);
    setShowGoalModal(false);
    setShowAnswerModal(false);
    setIsProcessing(false);
    generateNewTask();
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Spielregeln */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm">
          <h4 className="font-bold mb-2">Spielregeln:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Löse Potenzaufgaben, um den Ball ins gegnerische Tor zu bringen</li>
            <li>Richtige Antwort = Ball bewegt sich vorwärts</li>
            <li>Falsche Antwort = Ball bewegt sich rückwärts</li>
            <li>Erster mit 3 Toren gewinnt!</li>
          </ul>
        </div>

        {/* Spielstand */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Du: {playerScore}</span>
            <span className="text-2xl">⚽ Potenz-Fußball</span>
            <span>Gegner: {opponentScore}</span>
          </div>
        </div>

        {/* Fußballfeld */}
        <div className="bg-green-600 rounded-lg p-6 mb-6 shadow-lg relative overflow-hidden">
          {/* Feldlinien und Struktur */}
          <div className="relative h-48 bg-green-500 rounded border-4 border-white">
            
            {/* Mittellinie */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white transform -translate-x-1/2"></div>
            
            {/* Mittelkreis */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Linker Strafraum (Mein Tor) */}
            <div className="absolute top-8 bottom-8 left-0 w-12 border-r-2 border-t-2 border-b-2 border-white"></div>
            <div className="absolute top-16 bottom-16 left-0 w-6 border-r-2 border-t-2 border-b-2 border-white"></div>
            
            {/* Rechter Strafraum (Gegnertor) */}
            <div className="absolute top-8 bottom-8 right-0 w-12 border-l-2 border-t-2 border-b-2 border-white"></div>
            <div className="absolute top-16 bottom-16 right-0 w-6 border-l-2 border-t-2 border-b-2 border-white"></div>
            
            {/* Tore */}
            <div className="absolute top-20 bottom-20 left-0 w-1 bg-yellow-300"></div>
            <div className="absolute top-20 bottom-20 right-0 w-1 bg-yellow-300"></div>
            
            {/* Eckfahnen */}
            <div className="absolute top-0 left-0 w-1 h-3 bg-yellow-400"></div>
            <div className="absolute bottom-0 left-0 w-1 h-3 bg-yellow-400"></div>
            <div className="absolute top-0 right-0 w-1 h-3 bg-yellow-400"></div>
            <div className="absolute bottom-0 right-0 w-1 h-3 bg-yellow-400"></div>
            
            {/* Ball Position - dynamisch basierend auf ballPosition */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-in-out z-10"
              style={{
                left: `${(ballPosition / 6) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-4xl drop-shadow-lg">⚽</div>
            </div>
            
            {/* Feldmarkierungen */}
            <div className="absolute top-0 bottom-0 left-1/6 w-px bg-white opacity-30"></div>
            <div className="absolute top-0 bottom-0 left-2/6 w-px bg-white opacity-30"></div>
            <div className="absolute top-0 bottom-0 right-2/6 w-px bg-white opacity-30"></div>
            <div className="absolute top-0 bottom-0 right-1/6 w-px bg-white opacity-30"></div>
          </div>
          
          {/* Positionsanzeigen unter dem Feld */}
          <div className="mt-4 flex justify-between text-xs text-white font-semibold">
            <span>🥅 Mein Tor</span>
            <span>Verteidigung</span>
            <span>Def. MF</span>
            <span>Mitte</span>
            <span>Off. MF</span>
            <span>Sturm</span>
            <span>🥅 Gegnertor</span>
          </div>
        </div>

        {/* Antwort-Modal */}
        {showAnswerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center shadow-2xl">
              <div className="text-4xl mb-4">
                {answerResult.isCorrect ? '✅' : '❌'}
              </div>
              <div className="text-lg mb-6">
                {answerResult.message}
              </div>
              <button
                onClick={() => handleAnswerModalClose(answerResult.isCorrect)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                {answerResult.isCorrect ? 'Weiter spielen' : 'OK, verstanden'}
              </button>
            </div>
          </div>
        )}

        {/* Feedback Pop-up */}
        {showFeedbackPopup && feedback && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className={`rounded-lg p-4 shadow-lg font-bold text-center animate-pulse ${
              feedback.includes('✅') 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {feedback}
            </div>
          </div>
        )}

        {/* Aufgabe */}
        {currentTask && !gameOver && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-center">Löse die Potenzaufgabe:</h3>
            <div className="text-center mb-6">
              <span className="text-2xl font-mono bg-gray-100 p-3 rounded">
                {currentTask.question} = 
              </span>
            </div>
            
            {/* Eingabefelder als Potenz dargestellt */}
            <div className="flex justify-center items-center mb-6">
              <input
                type="text"
                value={basisInput}
                onChange={(e) => setBasisInput(e.target.value)}
                placeholder="Basis"
                className="border-2 border-gray-300 rounded p-2 w-20 text-center text-lg mr-1"
                disabled={gameOver}
              />
              <input
                type="text"
                value={exponentInput}
                onChange={(e) => setExponentInput(e.target.value)}
                placeholder="Exp."
                className="border-2 border-gray-300 rounded p-1 w-16 text-center text-sm"
                style={{ verticalAlign: 'super', fontSize: '14px', height: '30px' }}
                disabled={gameOver}
              />
            </div>
            
            <div className="text-center">
              <button
                onClick={checkAnswer}
                disabled={gameOver || isProcessing}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:bg-gray-400"
              >
                {isProcessing ? 'Wird geprüft...' : 'Antwort prüfen'}
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && gameOver && (
          <div className={`rounded-lg p-4 mb-6 text-center font-bold ${
            feedback.includes('🎉') 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

        {/* Tor-Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="text-6xl mb-4">
                {goalInfo.scorer === 'Du' ? '🎉' : '😞'}
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {goalInfo.scorer === 'Du' ? 'TOOOOR!' : 'Gegner-Tor...'}
              </h2>
              <p className="text-lg mb-6">
                <strong>{goalInfo.scorer}</strong> {goalInfo.scorer === 'Du' ? 'hast' : 'hat'} ein Tor geschossen!
              </p>
              <div className="text-xl font-bold mb-6 p-4 bg-gray-100 rounded">
                Spielstand: Du {goalInfo.newPlayerScore} - {goalInfo.newOpponentScore} Gegner
              </div>
              <button
                onClick={handleGoalModalClose}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
              >
                Weiter spielen
              </button>
            </div>
          </div>
        )}

        {/* Neues Spiel Button */}
        {gameOver && (
          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              Neues Spiel starten
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PotenzFussballSpiel;
