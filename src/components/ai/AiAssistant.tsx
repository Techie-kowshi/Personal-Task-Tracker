import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Lightbulb, Clock, Target, Zap } from 'lucide-react';
import { Task } from '@/types/task';

interface AiAssistantProps {
  tasks: Task[];
  onAddTask: (taskData: { title: string; description: string; priority?: 'low' | 'medium' | 'high' }) => void;
}

const AiAssistant = ({ tasks, onAddTask }: AiAssistantProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const aiSuggestions = [
    {
      icon: Lightbulb,
      title: "Smart Breakdown",
      description: "Break complex tasks into smaller steps",
      action: () => suggestTaskBreakdown()
    },
    {
      icon: Clock,
      title: "Time Estimate",
      description: "Get AI time estimates for tasks",
      action: () => estimateTime()
    },
    {
      icon: Target,
      title: "Priority Sorting",
      description: "AI-powered priority recommendations",
      action: () => suggestPriorities()
    },
    {
      icon: Zap,
      title: "Quick Add",
      description: "Create tasks from natural language",
      action: () => setPrompt("Add task: ")
    }
  ];

  const generateTaskSuggestions = () => {
    const suggestions = [
      { title: "Review and organize workspace", priority: 'medium' as const },
      { title: "Plan weekly goals and objectives", priority: 'high' as const },
      { title: "Update project documentation", priority: 'low' as const },
      { title: "Schedule team check-in meeting", priority: 'high' as const },
      { title: "Research new productivity tools", priority: 'low' as const },
      { title: "Complete pending code reviews", priority: 'medium' as const },
      { title: "Backup important files", priority: 'medium' as const },
      { title: "Clean email inbox", priority: 'low' as const },
      { title: "Prepare presentation slides", priority: 'high' as const },
      { title: "Review budget and expenses", priority: 'medium' as const }
    ];
    
    return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  const suggestTaskBreakdown = () => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) return;
    
    const complexTask = incompleteTasks.find(t => t.description.length > 50) || incompleteTasks[0];
    const breakdown = [
      `Research for: ${complexTask.title}`,
      `Draft initial plan for: ${complexTask.title}`,
      `Execute main work for: ${complexTask.title}`,
      `Review and finalize: ${complexTask.title}`
    ];
    
    breakdown.forEach((task, index) => {
      onAddTask({ 
        title: task, 
        description: `AI-suggested breakdown step`, 
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low'
      });
    });
  };

  const estimateTime = () => {
    // Simple AI simulation for time estimation
    alert("AI Analysis: Based on task complexity, estimated completion time is 2-4 hours for current pending tasks.");
  };

  const suggestPriorities = () => {
    alert("AI Priority Analysis: Focus on tasks with deadlines first, then high-impact items.");
  };

  const handleAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsThinking(true);
    
    // Simulate AI processing
    setTimeout(() => {
      if (prompt.toLowerCase().includes('add task:')) {
        const taskTitle = prompt.replace(/add task:\s*/i, '').trim();
        if (taskTitle) {
          const aiPriority = taskTitle.toLowerCase().includes('urgent') || taskTitle.toLowerCase().includes('important') ? 'high' : 'medium';
          onAddTask({ 
            title: taskTitle, 
            description: `AI-generated task from: "${prompt}"`,
            priority: aiPriority
          });
        }
      } else {
        // Generate task based on prompt
        const aiPriority = prompt.toLowerCase().includes('urgent') || prompt.toLowerCase().includes('important') ? 'high' : 'medium';
        onAddTask({ 
          title: `AI Suggestion: ${prompt}`, 
          description: `Generated from AI prompt: "${prompt}"`,
          priority: aiPriority
        });
      }
      
      setPrompt('');
      setIsThinking(false);
    }, 1500);
  };

  const productivity = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <Card className="w-80 mb-4 glass shadow-ai animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-ai-primary">
              <Brain className="w-5 h-5" />
              AI Assistant
              <Badge className="bg-ai-primary/20 text-ai-primary border-ai-primary/30">
                β
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Productivity Insight */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-ai-primary/10 to-ai-secondary/10 border border-ai-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Productivity Score</span>
                <Badge variant="secondary">{productivity}%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full gradient-ai transition-all duration-500"
                  style={{ width: `${productivity}%` }}
                />
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={suggestion.action}
                  className="w-full justify-start h-auto p-2 text-left hover:bg-ai-primary/10"
                >
                  <suggestion.icon className="w-4 h-4 mr-2 text-ai-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* AI Chat Input */}
            <form onSubmit={handleAiPrompt} className="space-y-2">
              <Input
                placeholder="Ask AI to create tasks..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isThinking}
                className="border-ai-primary/30 focus:border-ai-primary"
              />
              <Button 
                type="submit" 
                disabled={!prompt.trim() || isThinking}
                className="w-full gradient-ai text-white hover:shadow-ai transition-all duration-300"
              >
                {isThinking ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    AI Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </form>

            {/* Quick Suggestions */}
            {tasks.length === 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Quick Start:</div>
                {generateTaskSuggestions().map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTask({ 
                      title: suggestion.title, 
                      description: 'AI-suggested task',
                      priority: suggestion.priority 
                    })}
                    className="w-full text-xs h-8 border-ai-primary/30 hover:bg-ai-primary/10 flex items-center justify-between"
                  >
                    <span>+ {suggestion.title}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        suggestion.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                        suggestion.priority === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-success/20 text-success'
                      }`}
                    >
                      {suggestion.priority}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="h-12 w-12 rounded-full gradient-ai shadow-ai hover:shadow-glow transition-all duration-300 animate-float"
      >
        <Brain className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};

export default AiAssistant;