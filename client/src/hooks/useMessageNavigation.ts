/**
 * Custom hook to handle message navigation and scrolling
 * Provides functionality to scroll to specific messages with highlight effects
 */
export const useMessageNavigation = () => {
  const scrollToMessage = (messageId: string): void => {
    const messageElement = document.getElementById(messageId);
    
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add highlight effect
      messageElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    } else {
      console.log('Message element not found:', messageId);
    }
  };

  return { scrollToMessage };
}; 