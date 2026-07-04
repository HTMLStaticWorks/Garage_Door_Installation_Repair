import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

broken_pattern = r'<p class="card-description">Same-day emergency fix for broken torsion springs, snapped cables, and off-track doors\.</p>.*?<span class="tab-title">Broken Springs</span>'

replacement = '''<p class="card-description">Same-day emergency fix for broken torsion springs, snapped cables, and off-track doors.</p>
        </div>
        <!-- Service Card 3 -->
        <div class="card card-top-accent fade-in-up">
          <div class="card-image-container">
            <img src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&h=400&q=80" alt="Smartphone with smart home opener app">
          </div>
          <h3 class="card-title">Smart Opener Upgrade</h3>
          <p class="card-description">WiFi-enabled LiftMaster or Chamberlain opener installations with secure smartphone app control.</p>
        </div>
      </div>
      
      <div class="text-center fade-in-up" style="margin-top: calc(var(--space) * 6);">
        <a href="signup.html" class="btn btn-primary">Enquire Now</a>
      </div>
    </div>
  </section>

  <!-- SECTION 4: IMAGE + TEXT SPLIT -->
  <section class="section section-alt" id="about-split">
    <div class="container grid-2">
      <div class="split-image-container fade-in-left">
        <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&h=600&q=80" alt="Technician repairing garage door spring mechanism">
      </div>
      <div class="split-content fade-in-right">
        <h2 class="section-title" style="margin-left: 0; text-align: start;">We Fix It Right The First Time</h2>
        <p>ProLift brings elite repairs directly to your driveway. We specialize in diagnosing issues instantly, quoting transparent flat rates, and executing permanent repairs using industrial-grade components.</p>
        <ul class="checklist">
          <li class="checklist-item"><i class="fa-solid fa-circle-check"></i> Licensed, bonded, and fully insured technicians</li>
          <li class="checklist-item"><i class="fa-solid fa-circle-check"></i> All major brands and mechanisms serviced</li>
          <li class="checklist-item"><i class="fa-solid fa-circle-check"></i> Premium hardware parts backed by warranties</li>
          <li class="checklist-item"><i class="fa-solid fa-circle-check"></i> Clear, upfront, flat-rate pricing</li>
        </ul>
        <div>
          <a href="services.html" class="btn btn-outline-primary" style="margin-top: var(--space);">See All Services <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: INTERACTIVE DIAGNOSTIC CENTER -->
  <section class="section section-alt" id="diagnostics">
    <div class="container">
      <div class="text-center">
        <h2 class="section-title fade-in">Interactive Diagnostic Center</h2>
        <p class="section-subtitle fade-in">Click on any common garage door issue below to identify potential risks and get recommended solutions instantly.</p>
      </div>

      <div class="diagnostics-layout scale-in">
        <!-- Tabs List -->
        <div class="diag-tabs">
          <button class="diag-tab-btn active" data-target="spring" aria-label="Diagnose Broken Springs">
            <span class="tab-icon"><i class="fa-solid fa-gears"></i></span>
            <span class="tab-label">
              <span class="tab-title">Broken Springs</span>'''

new_content = re.sub(broken_pattern, replacement, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
