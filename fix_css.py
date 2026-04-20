with open("src/app/globals.css", "r") as f:
    text = f.read()

text = text.replace('''
@keyframes stripe-flow {
  0% { background-position: 0% 0; }
  100% { background-position: -200% 0; }
}

.animate-stripe {
  background-size: 200% 100% !important;
  animation: stripe-flow 8s linear infinite;
}''', '''
@keyframes stripe-flow {
  0% { background-position: 0% 0; }
  100% { background-position: 200% 0; }
}

.animate-stripe {
  background-size: 200% 100% !important;
  animation: stripe-flow 8s linear infinite !important;
}''')

with open("src/app/globals.css", "w") as f:
    f.write(text)

