/**
 * Code & Architecture Inspector Modal
 * Displays comprehensive, production-ready scripts for:
 * 1. Legendary Stadium, Cinematic Lighting, Grass Shader & Cloth Net Physics
 * 2. Ball Rigidbody Physics, 3rd Person Controller, Dribble & Shooting Mechanics
 * 3. Goal Trigger, Match Scoreboard UI Canvas, Fireworks Particles & Game Manager
 * Available in both Unity (C#) and Three.js (TypeScript) formats with one-click copy.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Code2, Layers, Cpu, Compass, BookOpen } from 'lucide-react';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stadium' | 'physics' | 'match' | 'unity_setup'>('unity_setup');
  const [activeLang, setActiveLang] = useState<'unity_csharp' | 'threejs_ts'>('unity_csharp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>أكواد وسكريبتات تطوير لعبة كرة القدم 3D</span>
              </h2>
              <p className="text-xs text-slate-400">
                أكواد برمجية جاهزة للنسخ والاستخدام في Unity (C#) و Three.js (TypeScript) مع الشرح الكامل.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('unity_setup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'unity_setup'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🤖 إعداد Unity و NavMesh والروبوتات</span>
            </button>

            <button
              onClick={() => setActiveTab('stadium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stadium'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. الملعب الأسطوري والشباك</span>
            </button>

            <button
              onClick={() => setActiveTab('physics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'physics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>2. فيزياء الكرة والتحكم</span>
            </button>

            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'match'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3. الأهداف والواجهة</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveLang('unity_csharp')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeLang === 'unity_csharp' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unity C#
            </button>
            <button
              onClick={() => setActiveLang('threejs_ts')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeLang === 'threejs_ts' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Three.js / TS
            </button>
          </div>
        </div>

        {/* Code Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 font-mono-code text-xs">
          {activeTab === 'unity_setup' && (
            <UnityNavMeshSection
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {activeTab === 'stadium' && (
            <StadiumCodeSection
              lang={activeLang}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {activeTab === 'physics' && (
            <PhysicsCodeSection
              lang={activeLang}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {activeTab === 'match' && (
            <MatchCodeSection
              lang={activeLang}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================================================
   UNITY 5v5 NAVMESH & ROBOTS SETUP GUIDE
   ======================================================== */
interface UnityNavMeshSectionProps {
  copiedKey: string | null;
  onCopy: (code: string, key: string) => void;
}

const UnityNavMeshSection: React.FC<UnityNavMeshSectionProps> = ({ copiedKey, onCopy }) => {
  const robotScript = `// ============================================================================
// 1. RobotNavMeshPlayer.cs (ضعه على مجسم كل روبوت في فريقك أو فريق الخصم)
// يتطلب وجود مكون NavMeshAgent على نفس المجسم
// ============================================================================
using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class RobotNavMeshPlayer : MonoBehaviour
{
    private NavMeshAgent agent;

    [Header("بيانات الروبوت والفريق")]
    public enum TeamSide { Home, Away }
    public TeamSide team = TeamSide.Away;
    public enum Role { Striker, Midfielder, Defender, Goalkeeper }
    public Role role = Role.Striker;

    [Header("المرجع للكرة والمرمى")]
    public Transform ballTransform;          // اسحب كائن الكرة إلى هنا
    public Transform opponentGoalTransform;  // اسحب مرمى الخصم إلى هنا
    public Transform userPlayerTransform;    // اسحب اللاعب (الكابتن) إلى هنا

    [Header("سرعات وقدرات الروبوت")]
    public float pursueSpeed = 6.5f;
    public float passDistance = 15.0f;
    public float shootDistance = 22.0f;
    public float kickPower = 24.0f;

    private Vector3 homeAnchorPos;
    private Rigidbody ballRb;
    private float kickCooldown = 0f;

    void Awake()
    {
        agent = GetComponent<NavMeshAgent>();
        homeAnchorPos = transform.position;

        // إعدادات الـ NavMeshAgent لحركة كروية سلسة وسريعة
        agent.speed = pursueSpeed;
        agent.acceleration = 18f;
        agent.angularSpeed = 360f;
        agent.stoppingDistance = 0.6f;
    }

    void Start()
    {
        if (ballTransform != null)
            ballRb = ballTransform.GetComponent<Rigidbody>();
    }

    void Update()
    {
        if (ballTransform == null) return;
        kickCooldown -= Time.deltaTime;

        float distToBall = Vector3.Distance(transform.position, ballTransform.position);

        // 1. إذا اقترب الروبوت من الكرة جداً، يقوم بركلها (تسديد أو تمرير)
        if (distToBall < 1.3f && kickCooldown <= 0f)
        {
            PerformKickAction();
            kickCooldown = 1.2f;
        }
        else
        {
            // 2. التحرك والتمركز عبر نظام الـ NavMesh الذكي
            DecideMovementTarget(distToBall);
        }
    }

    void DecideMovementTarget(float distToBall)
    {
        // إذا كانت الكرة في منطقته أو قريبة، يطارد الكرة مباشرة
        if (distToBall < 20f && role != Role.Goalkeeper)
        {
            agent.SetDestination(ballTransform.position);
        }
        else
        {
            // التمركز التكتيكي حول موقع البداية مع تتبع محور الهجمة
            Vector3 targetPos = homeAnchorPos;
            targetPos.z += (ballTransform.position.z - homeAnchorPos.z) * 0.35f;
            targetPos.x += (ballTransform.position.x - homeAnchorPos.x) * 0.25f;
            agent.SetDestination(targetPos);
        }
    }

    void PerformKickAction()
    {
        if (ballRb == null) return;

        float distToGoal = opponentGoalTransform != null ? 
            Vector3.Distance(transform.position, opponentGoalTransform.position) : 99f;

        // قرار التسديد إذا كان قريباً من المرمى
        if (distToGoal < shootDistance && opponentGoalTransform != null)
        {
            Vector3 shootDir = (opponentGoalTransform.position - transform.position).normalized;
            shootDir.y = 0.25f; // ارتفاع خفيف للكرة
            ballRb.linearVelocity = shootDir * (kickPower + Random.Range(0f, 6f));
        }
        // قرار التمرير للاعبك (إذا كان الروبوت في فريقك)
        else if (team == TeamSide.Home && userPlayerTransform != null)
        {
            Vector3 passDir = (userPlayerTransform.position - transform.position).normalized;
            passDir.y = 0.05f; // تمريرة أرضية دقيقة
            ballRb.linearVelocity = passDir * 16.0f;
        }
        // تشتيت الكرة للأمام
        else if (opponentGoalTransform != null)
        {
            Vector3 clearDir = (opponentGoalTransform.position - transform.position).normalized;
            clearDir.y = 0.2f;
            ballRb.linearVelocity = clearDir * kickPower;
        }
    }
}`;

  const playerScript = `// ============================================================================
// 2. SmoothPlayerController.cs (ضعه على كائن اللاعب الأساسي Player)
// تحكم مباشر وسريع لليمين والشمال والأمام والخلف، مع الجري وشحن التسديد
// ============================================================================
using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class SmoothPlayerController : MonoBehaviour
{
    private CharacterController controller;

    [Header("سرعات اللاعب والتحكم")]
    public float walkSpeed = 6.2f;
    public float sprintSpeed = 9.8f;
    public float turnSpeed = 24.0f;

    [Header("الكرة والمراوغة")]
    public Transform ballTransform;
    public float dribbleRadius = 1.5f;

    [Header("التسديد")]
    public Transform opponentGoalTransform;
    public float maxShootVelocity = 34.0f;
    private float shotCharge = 0f;
    private bool isCharging = false;
    private Rigidbody ballRb;

    void Awake()
    {
        controller = GetComponent<CharacterController>();
        if (ballTransform != null)
            ballRb = ballTransform.GetComponent<Rigidbody>();
    }

    void Update()
    {
        // 1. قراءة أزرار الحركة (يمين وشمال وأمام وخلف)
        float h = Input.GetAxisRaw("Horizontal"); // A / D أو الأسهم (يمين وشمال)
        float v = Input.GetAxisRaw("Vertical");   // W / S أو الأسهم (أمام وخلف)

        Vector3 moveInput = new Vector3(h, 0, v).normalized;
        bool isSprinting = Input.GetKey(KeyCode.LeftShift);
        float currentSpeed = isSprinting ? sprintSpeed : walkSpeed;

        if (moveInput.magnitude > 0.05f)
        {
            // تدوير فوري وسلس باتجاه الحركة
            float targetAngle = Mathf.Atan2(moveInput.x, moveInput.z) * Mathf.Rad2Deg;
            float angle = Mathf.LerpAngle(transform.eulerAngles.y, targetAngle, Time.deltaTime * turnSpeed);
            transform.rotation = Quaternion.Euler(0, angle, 0);

            // تحريك اللاعب
            Vector3 movement = transform.forward * currentSpeed;
            controller.Move(movement * Time.deltaTime);
        }

        // 2. المراوغة الذكية والتصاق الكرة بالقدم
        if (ballTransform != null)
        {
            float distToBall = Vector3.Distance(transform.position, ballTransform.position);
            if (distToBall < dribbleRadius)
            {
                Vector3 idealPos = transform.position + transform.forward * 0.75f;
                idealPos.y = 0.22f;
                ballTransform.position = Vector3.Lerp(ballTransform.position, idealPos, Time.deltaTime * 12f);
            }

            // 3. شحن وإطلاق التسديدة (زر المسافة Space)
            if (Input.GetKey(KeyCode.Space) && distToBall < dribbleRadius + 0.5f)
            {
                isCharging = true;
                shotCharge = Mathf.Clamp01(shotCharge + Time.deltaTime * 1.5f);
            }
            else if (isCharging)
            {
                // إطلاق التسديدة الصاروخية!
                Vector3 shootDir = transform.forward;
                if (opponentGoalTransform != null)
                {
                    shootDir = (opponentGoalTransform.position - transform.position).normalized;
                }
                shootDir.y = 0.2f + shotCharge * 0.35f;

                if (ballRb != null)
                {
                    ballRb.linearVelocity = shootDir.normalized * (16f + shotCharge * (maxShootVelocity - 16f));
                }

                isCharging = false;
                shotCharge = 0f;
            }
        }
    }
}`;

  return (
    <div className="space-y-4">
      {/* Visual Guide Card */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/40 space-y-3">
        <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
          <span>🛠️ دليل إعداد Unity خطوة بخطوة (NavMesh + Player + Robots)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1">1. إعداد أرضية الملعب (Bake NavMesh):</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>أنشئ أرضية الملعب (Plane أو Cube) بأبعاد (X: 68, Z: 105).</li>
              <li>في نافذة Inspector: فعّل خيار <strong>Navigation Static</strong>.</li>
              <li>من القائمة العلوية: <code>Window &gt; AI &gt; Navigation</code>.</li>
              <li>اضغط على تبويب <strong>Bake</strong> ثم انقر زر <strong>Bake</strong> ليظهر غطاء أزرق يمثل مسار حركة الروبوتات!</li>
            </ul>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="font-bold text-sky-300 block mb-1">2. إعداد الروبوتات (Robots / AI Players):</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>أنشئ روبوتاً (Capsule أو مجسم روبوت ثلاثي الأبعاد).</li>
              <li>أضف له مكون: <code>Component &gt; Navigation &gt; NavMeshAgent</code>.</li>
              <li>اسحب سكريبت <code>RobotNavMeshPlayer.cs</code> إليه.</li>
              <li>اسحب كائن الكرة ومرمى الخصم في خانات السكريبت في الـ Inspector.</li>
            </ul>
          </div>
        </div>

        {/* Engine Note */}
        <div className="bg-blue-950/40 p-2.5 rounded-lg border border-blue-800/60 text-xs text-blue-200">
          <span className="font-bold">ملاحظة المحركات الأخرى:</span> إذا كنت تستخدم <strong>Unreal Engine</strong>، يتم استخدام <code>NavMeshBoundsVolume</code> مع <code>AIController</code>، وفي <strong>Roblox</strong> يتم استخدام <code>PathfindingService</code> مع <code>Humanoid:MoveTo()</code>.
        </div>
      </div>

      {/* Code Blocks */}
      <CodeBlock
        title="RobotNavMeshPlayer.cs (كود الروبوتات مع NavMeshAgent للمطاردة والتمرير والتسديد)"
        code={robotScript}
        copied={copiedKey === 'robot_script'}
        onCopy={() => onCopy(robotScript, 'robot_script')}
      />

      <CodeBlock
        title="SmoothPlayerController.cs (كود تحكم اللاعب السريع يمين وشمال مع المراوغة والتسديد)"
        code={playerScript}
        copied={copiedKey === 'player_script'}
        onCopy={() => onCopy(playerScript, 'player_script')}
      />
    </div>
  );
};

interface SectionProps {
  lang: 'unity_csharp' | 'threejs_ts';
  copiedKey: string | null;
  onCopy: (code: string, key: string) => void;
}

/* ========================================================
   PART 1: STADIUM, LIGHTING, GRASS & CLOTH NET
   ======================================================== */
const StadiumCodeSection: React.FC<SectionProps> = ({ lang, copiedKey, onCopy }) => {
  const unityCode1 = `// ============================================================================
// 1. CinematicStadiumLighting.cs (ضع هذا الكود على كائن مدير الإضاءة في الملعب)
// ============================================================================
using UnityEngine;

public class CinematicStadiumLighting : MonoBehaviour
{
    [Header("أبراج الإضاءة الأسطورية (Floodlight Masts)")]
    public Light[] cornerSpotlights;      // 4 كشافات إضاءة رئيسية في زوايا الملعب
    public GameObject volumetricBeamPrefab; // مخروط شعاع الإضاءة شبه الشفاف (Volumetric Beam)
    public Light ambientPitchLight;       // إضاءة ليلية عامة ناعمة (Night Ambient)

    [Header("إعدادات التظليل الليلي")]
    public Color nightSkyColor = new Color(0.02f, 0.05f, 0.12f);
    public Color floodlightColor = new Color(1.0f, 0.98f, 0.88f);
    public float floodlightIntensity = 3.5f;

    void Start()
    {
        // 1. إعداد لون الضباب الليلي (Fog) والبيئة
        RenderSettings.fog = true;
        RenderSettings.fogMode = FogMode.ExponentialSquared;
        RenderSettings.fogDensity = 0.006f;
        RenderSettings.fogColor = nightSkyColor;
        RenderSettings.ambientLight = nightSkyColor * 0.8f;

        // 2. ضبط الكشافات الأربعة لتركز على نقطة المنتصف ومنطقتي الجزاء
        Vector3 pitchCenter = Vector3.zero;
        foreach (Light spot in cornerSpotlights)
        {
            if (spot == null) continue;
            spot.color = floodlightColor;
            spot.intensity = floodlightIntensity;
            spot.shadows = LightShadows.Soft; // تظليل واقعي ناعم
            spot.shadowResolution = UnityEngine.Rendering.LightShadowResolution.High;
            spot.transform.LookAt(pitchCenter);
        }
    }

    // تأثير وميض الأضواء عند تسجيل الهدف (Goal Strobe)
    public void TriggerGoalStrobe(int flashes = 10, float interval = 0.12f)
    {
        StartCoroutine(StrobeRoutine(flashes, interval));
    }

    private System.Collections.IEnumerator StrobeRoutine(int flashes, float interval)
    {
        for (int i = 0; i < flashes; i++)
        {
            float intensity = (i % 2 == 0) ? floodlightIntensity * 1.8f : 0.8f;
            foreach (Light spot in cornerSpotlights) spot.intensity = intensity;
            yield return new WaitForSeconds(interval);
        }
        foreach (Light spot in cornerSpotlights) spot.intensity = floodlightIntensity;
    }
}`;

  const unityCode2 = `// ============================================================================
// 2. ClothGoalNet.cs (ضع هذا الكود على كائن شباك المرمى Goal Net)
// ============================================================================
using UnityEngine;

[RequireComponent(typeof(Cloth))]
public class ClothGoalNet : MonoBehaviour
{
    private Cloth netCloth;
    [Header("إعدادات فيزياء الشباك (Cloth Physics)")]
    public float stretchingStiffness = 0.85f;  // صلابة الشد لمنع تمزق الشبكة
    public float bendingStiffness = 0.5f;     // مقاومة الانحناء
    public float damping = 0.35f;             // امتصاص طاقة وسرعة الكرة عند الاصطدام

    void Awake()
    {
        netCloth = GetComponent<Cloth>();
        SetupNetPhysics();
    }

    void SetupNetPhysics()
    {
        netCloth.stretchingStiffness = stretchingStiffness;
        netCloth.bendingStiffness = bendingStiffness;
        netCloth.damping = damping;
        netCloth.useGravity = true;

        // تثبيت أطراف الشباك على القوائم والعارضة (Pinning Border Vertices)
        ClothSkinningCoefficient[] coeffs = netCloth.coefficients;
        for (int i = 0; i < coeffs.Length; i++)
        {
            Vector3 vPos = netCloth.vertices[i];
            // إذا كان الرأس ملاصقاً للعارضة أو القائم أو الأرضية، اجعل مسافة الحركة = 0
            bool isBorder = Mathf.Abs(vPos.x) > 3.5f || vPos.y > 2.3f || vPos.y < 0.1f;
            coeffs[i].maxDistance = isBorder ? 0.0f : 0.65f; // انتفاخ الشبكة حتى 65 سم للداخل
        }
        netCloth.coefficients = coeffs;
    }

    // تسجيل اصطدام الكرة بالشباك لإصدار صوت حفيف الشباك
    public void AddBallCollider(SphereCollider ballCollider)
    {
        SphereCollider[] colliders = new SphereCollider[] { ballCollider };
        netCloth.sphereColliders = new ClothSphereColliderPair[] {
            new ClothSphereColliderPair(ballCollider)
        };
    }
}`;

  const tsCode = `// ============================================================================
// Three.js / WebGL: بيئة الملعب والشباك الفيزيائية (Spring-Mass Cloth Net)
// ============================================================================
import * as THREE from 'three';
import { ClothGoalNet } from './clothNet';

export function setupLegendaryStadium(scene: THREE.Scene) {
  // 1. الإضاءة الليلية السينمائية وأبراج الكشافات
  const ambient = new THREE.AmbientLight(0x0f172a, 0.7);
  scene.add(ambient);

  const cornerMasts = [
    { x: -46, y: 34, z: -66, target: new THREE.Vector3(-15, 0, -25) },
    { x: 46, y: 34, z: -66, target: new THREE.Vector3(15, 0, -25) },
    { x: -46, y: 34, z: 66, target: new THREE.Vector3(-15, 0, 25) },
    { x: 46, y: 34, z: 66, target: new THREE.Vector3(15, 0, 25) }
  ];

  cornerMasts.forEach((mast) => {
    const spot = new THREE.SpotLight(0xfef08a, 2.8);
    spot.position.set(mast.x, mast.y, mast.z);
    spot.target.position.copy(mast.target);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    scene.add(spot);
    scene.add(spot.target);
  });

  // 2. شباك المرمى التفاعلية الفيزيائية (Cloth Physics Grid)
  const goalNet = new ClothGoalNet(new THREE.Vector3(0, 0, -52.5), 7.32, 2.44, 2.2, false);
  scene.add(goalNet.mesh);

  return { goalNet };
}`;

  return (
    <div className="space-y-4">
      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-300">
        <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>خطوات التثبيت والتطبيق في المشروع:</span>
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          1. في محرك Unity: أنشئ كائناً للملعب وضع سكريبت <code>CinematicStadiumLighting.cs</code> على كائن الإضاءة،
          وضع <code>ClothGoalNet.cs</code> على كائن شباك المرمى مع إضافة مكون Cloth.<br />
          2. في Three.js: استدعِ الدالة <code>buildLegendaryStadium()</code> لإضافة الأرضية والشباك النسيجية التفاعلية.
        </p>
      </div>

      {lang === 'unity_csharp' ? (
        <>
          <CodeBlock
            title="CinematicStadiumLighting.cs (إضاءة ليلية سينمائية وأبراج الكشافات)"
            code={unityCode1}
            copied={copiedKey === 'unity_light'}
            onCopy={() => onCopy(unityCode1, 'unity_light')}
          />
          <CodeBlock
            title="ClothGoalNet.cs (فيزياء شباك المرمى التفاعلية Cloth Physics)"
            code={unityCode2}
            copied={copiedKey === 'unity_net'}
            onCopy={() => onCopy(unityCode2, 'unity_net')}
          />
        </>
      ) : (
        <CodeBlock
          title="stadium.ts & clothNet.ts (Three.js WebGL Stadium & Spring Net)"
          code={tsCode}
          copied={copiedKey === 'ts_stadium'}
          onCopy={() => onCopy(tsCode, 'ts_stadium')}
        />
      )}
    </div>
  );
};

/* ========================================================
   PART 2: BALL & PLAYER CONTROLLER
   ======================================================== */
const PhysicsCodeSection: React.FC<SectionProps> = ({ lang, copiedKey, onCopy }) => {
  const unityCode1 = `// ============================================================================
// 1. SoccerBallPhysics.cs (ضع هذا الكود على كائن كرة القدم Ball مع Rigidbody)
// ============================================================================
using UnityEngine;

[RequireComponent(typeof(Rigidbody), typeof(SphereCollider))]
public class SoccerBallPhysics : MonoBehaviour
{
    private Rigidbody rb;
    [Header("معاملات ارتداد وانحناء الكرة")]
    public float mass = 0.43f;           // وزن الكرة الرسمي 430 جرام
    public float bounciness = 0.65f;     // ارتداد واقعي
    public float rollingFriction = 0.988f; // مقاومة التدحرج على العشب
    public float magnusCurveCoeff = 0.08f; // معامل انحناء ماغنوس في الهواء (Curve Effect)

    private Vector3 currentSpin = Vector3.zero;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.mass = mass;
        rb.drag = 0.15f;
        rb.angularDrag = 0.4f;
        rb.interpolation = RigidbodyInterpolation.Interpolate;
    }

    void FixedUpdate()
    {
        // 1. تطبيق تأثير ماغنوس لانحناء مسار الكرة في الهواء
        if (!IsGrounded() && currentSpin.sqrMagnitude > 0.01f)
        {
            Vector3 magnusForce = Vector3.Cross(currentSpin, rb.linearVelocity) * magnusCurveCoeff;
            rb.AddForce(magnusForce, ForceMode.Force);
            currentSpin = Vector3.Lerp(currentSpin, Vector3.zero, Time.fixedDeltaTime * 0.5f);
        }
    }

    // ركل الكرة مع تحديد قوة الضربة وزاوية الانحناء (Spin)
    public void Kick(Vector3 velocity, float spinAmount)
    {
        rb.linearVelocity = velocity;
        currentSpin = new Vector3(0, spinAmount * 15f, 0);
    }

    public bool IsGrounded()
    {
        return Physics.Raycast(transform.position, Vector3.down, 0.25f);
    }
}`;

  const unityCode2 = `// ============================================================================
// 2. ThirdPersonSoccerController.cs (تحكم اللاعب من منظور الشخص الثالث والمراوغة)
// ============================================================================
using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class ThirdPersonSoccerController : MonoBehaviour
{
    private CharacterController controller;
    public Transform cameraTransform;
    public SoccerBallPhysics ball;

    [Header("سرعات اللاعب والتحكم")]
    public float walkSpeed = 6.0f;
    public float sprintSpeed = 9.5f;
    public float rotationSpeed = 12.0f;
    public float dribbleDistance = 1.6f;

    [Header("نظام شحن التسديد (Shooting Mechanics)")]
    public float maxShotPower = 34.0f; // سرعة تصل لـ 120 كم/س
    public float powerChargeRate = 1.2f;
    private float currentPower = 0f;
    private bool isChargingShot = false;

    void Start()
    {
        controller = GetComponent<CharacterController>();
    }

    void Update()
    {
        // 1. قراءة مدخلات الحركة بالنسبة لزاوية الكاميرا
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");
        Vector3 inputDir = new Vector3(h, 0, v).normalized;

        bool isSprinting = Input.GetKey(KeyCode.LeftShift);
        float speed = isSprinting ? sprintSpeed : walkSpeed;

        if (inputDir.magnitude >= 0.1f)
        {
            float targetAngle = Mathf.Atan2(inputDir.x, inputDir.z) * Mathf.Rad2Deg + cameraTransform.eulerAngles.y;
            float angle = Mathf.LerpAngle(transform.eulerAngles.y, targetAngle, Time.deltaTime * rotationSpeed);
            transform.rotation = Quaternion.Euler(0, angle, 0);

            Vector3 moveDir = Quaternion.Euler(0, targetAngle, 0) * Vector3.forward;
            controller.Move(moveDir * speed * Time.deltaTime);
        }

        // 2. ميكانيكا المراوغة الذكية (Dribbling)
        float distToBall = Vector3.Distance(transform.position, ball.transform.position);
        if (distToBall < dribbleDistance)
        {
            // الكرة تلتصق أمام قدم اللاعب وتتحرك بتناغم معه
            Vector3 idealBallPos = transform.position + transform.forward * 0.75f;
            idealBallPos.y = 0.22f;
            ball.transform.position = Vector3.Lerp(ball.transform.position, idealBallPos, Time.deltaTime * 10f);
        }

        // 3. شحن وإطلاق التسديدة الصاروخية نحو المرمى
        if (Input.GetKey(KeyCode.Space) && distToBall < dribbleDistance + 0.5f)
        {
            isChargingShot = true;
            currentPower = Mathf.Clamp01(currentPower + Time.deltaTime * powerChargeRate);
        }
        else if (isChargingShot)
        {
            // إطلاق الكرة!
            ShootBall(currentPower);
            isChargingShot = false;
            currentPower = 0f;
        }
    }

    void ShootBall(float power)
    {
        Vector3 shotDir = transform.forward;
        shotDir.y = 0.2f + power * 0.35f; // ارتفاع الكرة حسب قوة التسديد
        Vector3 impulse = shotDir.normalized * (16f + power * (maxShotPower - 16f));

        float curve = transform.forward.x * 2.0f; // انحناء الضربة
        ball.Kick(impulse, curve);
    }
}`;

  const tsCode = `// ============================================================================
// Three.js / TypeScript: فيزياء الكرة وحركة اللاعب والمراوغة
// ============================================================================
import { SoccerBall } from './physics';
import { SoccerPlayer } from './player';

// تنفيذ التسديدة الصاروخية في Three.js
export function shootBallMechanic(player: SoccerPlayer, ball: SoccerBall, powerPercent: number) {
  const speed = 16.0 + powerPercent * (34.0 - 16.0); // 58 إلى 122 كم/س
  const elevation = 0.2 + powerPercent * 0.4;

  const shotVelocity = player.aimDirection.clone();
  shotVelocity.y = elevation;
  shotVelocity.normalize().multiplyScalar(speed);

  // تطبيق تأثير ماغنوس لانحناء الكرة
  const curveSpin = player.aimDirection.x * 1.5;
  ball.applyKick(shotVelocity, curveSpin, 'player');
}`;

  return (
    <div className="space-y-4">
      {lang === 'unity_csharp' ? (
        <>
          <CodeBlock
            title="SoccerBallPhysics.cs (فيزياء الكرة، الجاذبية والارتداد وانحناء ماغنوس)"
            code={unityCode1}
            copied={copiedKey === 'unity_ball'}
            onCopy={() => onCopy(unityCode1, 'unity_ball')}
          />
          <CodeBlock
            title="ThirdPersonSoccerController.cs (تحكم الشخص الثالث، المراوغة، وشحن التسديد)"
            code={unityCode2}
            copied={copiedKey === 'unity_player'}
            onCopy={() => onCopy(unityCode2, 'unity_player')}
          />
        </>
      ) : (
        <CodeBlock
          title="physics.ts & player.ts (Three.js Ball & Player Locomotion)"
          code={tsCode}
          copied={copiedKey === 'ts_physics'}
          onCopy={() => onCopy(tsCode, 'ts_physics')}
        />
      )}
    </div>
  );
};

/* ========================================================
   PART 3: GOAL TRIGGER, UI & FIREWORKS
   ======================================================== */
const MatchCodeSection: React.FC<SectionProps> = ({ lang, copiedKey, onCopy }) => {
  const unityCode1 = `// ============================================================================
// 1. GoalTrigger.cs (ضع هذا الكود على كائن Trigger داخل المرمى)
// ============================================================================
using UnityEngine;

[RequireComponent(typeof(BoxCollider))]
public class GoalTrigger : MonoBehaviour
{
    public bool isHomeGoal = false; // هل هذا مرمى المضيف أم الضيف؟
    public MatchGameManager matchManager;

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Ball"))
        {
            SoccerBallPhysics ball = other.GetComponent<SoccerBallPhysics>();
            matchManager.OnGoalScored(isHomeGoal, ball);
        }
    }
}`;

  const unityCode2 = `// ============================================================================
// 2. MatchGameManager.cs (إدارة المباراة، النتيجة، التوقيت، وإعادة السنترة)
// ============================================================================
using UnityEngine;
using TMPro;

public class MatchGameManager : MonoBehaviour
{
    [Header("لوحة النتيجة والواجهة Canvas UI")]
    public TextMeshProUGUI scoreText;      // مثال: "3 : 1"
    public TextMeshProUGUI timerText;      // مثال: "45:20"
    public GameObject goalBannerUI;        // بانر احتفال "GOOOOOAL!"

    [Header("مؤثرات تسجيل الهدف")]
    public ParticleSystem fireworksParticles; // نظام الألعاب النارية 3D
    public AudioSource crowdCheerAudio;       // صوت هتاف الجماهير
    public AudioSource whistleAudio;          // صفارة الحكم

    private int homeScore = 0;
    private int awayScore = 0;
    private float matchTimer = 0f;
    private bool isGoalPaused = false;

    void Update()
    {
        if (!isGoalPaused)
        {
            matchTimer += Time.deltaTime * 5f; // سرعة توقيت المباراة
            int mins = Mathf.FloorToInt(matchTimer / 60);
            int secs = Mathf.FloorToInt(matchTimer % 60);
            timerText.text = string.Format("{0:00}:{1:00}", mins, secs);
        }
    }

    public void OnGoalScored(bool homeTeamConceded, SoccerBallPhysics ball)
    {
        if (isGoalPaused) return;
        isGoalPaused = true;

        if (!homeTeamConceded) homeScore++;
        else awayScore++;

        scoreText.text = homeScore + " : " + awayScore;

        // تشغيل الألعاب النارية وهتاف الجماهير وبانر الهدف
        if (fireworksParticles != null) fireworksParticles.Play();
        if (crowdCheerAudio != null) crowdCheerAudio.Play();
        if (goalBannerUI != null) goalBannerUI.SetActive(true);

        // العودة لنقطة البداية (السنترة) بعد 4 ثوانٍ
        Invoke(nameof(ResetToKickoff), 4.0f);
    }

    void ResetToKickoff()
    {
        if (goalBannerUI != null) goalBannerUI.SetActive(false);
        if (whistleAudio != null) whistleAudio.Play();

        // إعادة الكرة واللاعبين لمنتصف الملعب
        GameObject ballObj = GameObject.FindWithTag("Ball");
        if (ballObj != null)
        {
            ballObj.transform.position = new Vector3(0, 0.22f, 0);
            ballObj.GetComponent<Rigidbody>().linearVelocity = Vector3.zero;
        }

        isGoalPaused = false;
    }
}`;

  return (
    <div className="space-y-4">
      {lang === 'unity_csharp' ? (
        <>
          <CodeBlock
            title="GoalTrigger.cs (منطقة احتساب الهدف داخل المرمى Trigger)"
            code={unityCode1}
            copied={copiedKey === 'unity_trigger'}
            onCopy={() => onCopy(unityCode1, 'unity_trigger')}
          />
          <CodeBlock
            title="MatchGameManager.cs (إدارة النتيجة، التوقيت، الألعاب النارية وإعادة السنترة)"
            code={unityCode2}
            copied={copiedKey === 'unity_manager'}
            onCopy={() => onCopy(unityCode2, 'unity_manager')}
          />
        </>
      ) : (
        <CodeBlock
          title="GameManager.ts & fireworks.ts (نظام الأهداف والألعاب النارية والسنترة)"
          code={`// استدعاء احتفال الهدف وإعادة السنترة في Three.js
stadium.triggerStrobe();
fireworks.triggerCelebration();
soundEngine.playGoalRoar();
soundEngine.playFireworkBoom();`}
          copied={copiedKey === 'ts_match'}
          onCopy={() => onCopy('stadium.triggerStrobe(); fireworks.triggerCelebration();', 'ts_match')}
        />
      )}
    </div>
  );
};

/* Helper for single code box */
interface CodeBlockProps {
  title: string;
  code: string;
  copied: boolean;
  onCopy: () => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, copied, onCopy }) => {
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <span className="font-bold text-amber-300 font-sans">{title}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-sans">نسخ الكود</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[11px] text-slate-300 leading-relaxed font-mono-code">
        <code>{code}</code>
      </pre>
    </div>
  );
};
