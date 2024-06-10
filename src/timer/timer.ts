//Es una modificación de: https://www.dhiwise.com/post/simplify-event-timing-and-scheduling-with-typescript-timer

export class Timer {
    private timerId: NodeJS.Timeout | null = null; // Cambio en el tipo de timerId
  
    constructor(private readonly duration: number) {} // Utilizando acceso directo en el constructor
  
    start(callback: () => void): void {
        const timerCallback = () => {
            callback(); // Ejecutar el callback
            this.timerId = setTimeout(timerCallback, this.duration); // Reiniciar el temporizador
        };

        // Iniciar el temporizador por primera vez
        this.timerId = setTimeout(timerCallback, this.duration);
    }
  
    stop(): void {
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }
  
    reset(callback: () => void): void {
      this.stop(); // Detener el temporizador actual si existe
      this.start(callback); // Iniciar un nuevo temporizador
    }
}