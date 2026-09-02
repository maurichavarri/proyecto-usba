console.log('1. Iniciando test...');

try {
    console.log('2. Importando app...');
    await import('./src/app.js');
    console.log('3. App importada correctamente');
} catch (error) {
    console.error('4. Error:', error.message);
    console.error('5. Stack:', error.stack);
}
