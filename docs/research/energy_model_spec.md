# GreenLogix Energy Model V1 Specification (GLX-HDT-v1)

**Version:** 1.0.0 (Research Specification)  
**Date:** 2026-09-21  
**Author:** GreenLogix Core Systems Team  
**Scope:** Heavy-duty and medium diesel commercial vehicle energy & fuel consumption estimation for Vietnam urban freight operations.

---

## 1. Scientific Foundations & Canonical Literature

| Foundation | Canonical Reference | DOI / Source | Role in GreenLogix |
|---|---|---|---|
| **Pollution-Routing Problem (PRP)** | Bektaş & Laporte (2011), *Transp. Res. Part B* 45(8):1232–1250 | `10.1016/j.trb.2011.02.004` | Theoretical formulation relating payload, speed, and grade to mechanical power. |
| **Heavy-Duty Truck Eco-Routing** | Scora, Boriboonsomsin & Barth (2015), *Res. Transp. Econ.* 52:3–14 | `10.1016/j.retrec.2015.10.002` | Practical multi-criteria fuel/time Pareto trade-off for urban and arterial road freight. |
| **Convex HDT Fuel Model** | Rakha et al. (2017), *Transp. Res. Part D* 55:127–141 | `10.1016/j.trd.2017.06.011` | Tractable convex fuel rate calculation calibrated across diesel truck weight classes. |
| **Uneven Topography PRP** | Lai et al. (2024), *Comput. Oper. Res.* 164:106557 | `10.1016/j.cor.2024.106557` | Load-dependent sequence ordering: dropping heavy cargo before steep gradients. |

---

## 2. Mechanical Equations & Governing Physics

For a road segment of length $d$ (meters) traversed at average speed $v$ ($m/s$) on road angle $\theta$ (radians) with vehicle total mass $M = M_{\text{empty}} + M_{\text{payload}}$ ($kg$):

### 2.1 Total Resistant Force ($F_{\text{total}}$)

$$F_{\text{total}} = F_{\text{roll}} + F_{\text{grade}} + F_{\text{aero}}$$

Where:
- **Rolling resistance:** $F_{\text{roll}} = C_r \cdot M \cdot g \cdot \cos(\theta)$
- **Gravitational gradient force:** $F_{\text{grade}} = M \cdot g \cdot \sin(\theta)$
- **Aerodynamic drag:** $F_{\text{aero}} = \frac{1}{2} \cdot \rho_{\text{air}} \cdot C_d \cdot A \cdot v^2$

### 2.2 Tractive Power Demand ($P_{\text{traction}}$)

$$P_{\text{traction}} = \max\left(0, F_{\text{total}} \cdot v\right)$$

Total engine brake power:
$$P_{\text{engine}} = \frac{P_{\text{traction}}}{\eta_{\text{driveline}}} + P_{\text{aux}}$$

Where:
- $\eta_{\text{driveline}} \approx 0.88$ (mechanical transmission efficiency).
- $P_{\text{aux}} \approx 1500\text{ W}$ (alternator, power steering, climate/air compression).

### 2.3 Fuel Consumption Rate ($\dot{m}_f$)

Fuel mass flow rate in $g/s$:
$$\dot{m}_f = \frac{\xi}{\kappa \cdot \psi} \cdot \left(k \cdot N \cdot V_{\text{disp}} + \frac{P_{\text{engine}}}{\eta_{\text{thermal}}}\right)$$

For operational simulation over segment of duration $t = d / v$ (seconds):
$$\text{Litres consumed} = \frac{\dot{m}_f \cdot t}{\rho_{\text{diesel}} \cdot 1000}$$

Where:
- $\rho_{\text{diesel}} \approx 0.84\text{ kg/L}$.
- Heating value $\psi \approx 43.2\text{ MJ/kg}$.
- Engine friction factor $k \approx 0.20\text{ kJ/(rev}\cdot\text{L)}$.
- Engine speed $N \approx 28\text{ rev/s}$ (1680 RPM).

---

## 3. Physical Monotonicity Invariants (Mandatory Test Gates)

1. **Grade Monotonicity:**  
   $$\frac{\partial \text{Fuel}}{\partial \theta} > 0 \quad (\text{uphill segment consumes strictly more fuel than identical flat segment}).$$
2. **Payload Monotonicity:**  
   $$\frac{\partial \text{Fuel}}{\partial M_{\text{payload}}} > 0 \quad (\text{heavier truck load consumes strictly more fuel in identical driving conditions}).$$
3. **Zero Movement Boundary:**  
   $$\lim_{d \to 0} \text{Movement Fuel}(d) = 0.$$
4. **Speed Non-Linearity:**  
   Aerodynamic drag scales quadratically with speed ($v^2$); excessive urban acceleration incurs steep fuel penalties.

---

## 4. Carbon Accounting Methodology (ISO 14083 / GLEC 3.2 Alignment)

- **TTW (Tank-to-Wheel) Emission Factor:**
  - Diesel: $2.68\text{ kg CO}_2\text{e} / \text{Litre}$.
  - Petrol: $2.31\text{ kg CO}_2\text{e} / \text{Litre}$.
- **WTW (Well-to-Wheel) Full Lifecycle Factor:**
  - Diesel: $3.24\text{ kg CO}_2\text{e} / \text{Litre}$.
  - Petrol: $2.82\text{ kg CO}_2\text{e} / \text{Litre}$.
- **Safe Claim Guard:** GreenLogix reports modeled fuel and GLEC-aligned estimates, never asserting certified third-party audit status until empirical OBD calibration trials are completed.
