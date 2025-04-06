console.log('[audioWorker] Worker script loaded.');

// Audio processing worker
self.onmessage = function(e) {
  console.log('[audioWorker] Message received:', e.data);
  const { audioData } = e.data;
  
  if (!audioData) {
    console.warn('[audioWorker] Received message without audioData.');
    return;
  }

  try {
    // Process audio data here
    const processedData = processAudioData(audioData);
    console.log('[audioWorker] Sending processed data:', processedData);
    // Send processed data back to main thread
    self.postMessage(processedData);
  } catch (error) {
    console.error('[audioWorker] Error processing audio data:', error);
    // Optionally, post an error message back
    self.postMessage({ error: error.message });
  }
};

function processAudioData(audioData) {
  // Ensure audioData is an array-like structure we can work with
  if (!audioData || typeof audioData.length !== 'number') {
    console.warn('[audioWorker] Invalid audioData format for processing.');
    return { average: 0 }; // Return default or error state
  }
  
  // Simple visualization data processing (assuming Uint8Array or similar)
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i];
  }
  const average = audioData.length > 0 ? sum / audioData.length : 0;
  return { average };
}

console.log('[audioWorker] Event listeners attached.'); 