import React from 'react'
import { Award, CheckCircle, Lock, Download, ExternalLink, Calendar, ShieldCheck } from 'lucide-react'

export default function CertificationsView({
  tracks = [],
  completedTopicIds = new Set(),
  userName = 'Vinay Kumar',
  onOpenCertificateModal,
}) {
  // Check which tracks have 100% completion or progress
  const certificationsData = tracks.map((track) => {
    const total = track.topicCount || 6
    let completed = 0
    if (track.modules) {
      track.modules.forEach((m) => {
        (m.topics || []).forEach((t) => {
          if (completedTopicIds.has(t.id)) completed++
        })
      })
    } else {
      completed = completedTopicIds.size > 0 ? Math.min(total, 2) : 0
    }
    const isCompleted = total > 0 && completed >= total
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      ...track,
      isCompleted,
      completedTopics: completed,
      totalTopics: total,
      pct,
      credentialId: `CC-2026-${(track.slug || 'CERT').toUpperCase()}-${(1000 + (track.id || 1) * 37)}`,
      issueDate: 'October 2026',
    }
  })

  const earnedCerts = certificationsData.filter((c) => c.isCompleted)
  const lockedCerts = certificationsData.filter((c) => !c.isCompleted)

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '26px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '26px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
          }}
        >
          My Verified Certifications
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Earn accredited completion certificates signed by the CampusConnect Academic & Placement Board upon completing all syllabus topics.
        </p>
      </div>

      {/* ── Earned Certificates Section ── */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldCheck size={18} style={{ color: '#059669' }} />
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: '18px',
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
            }}
          >
            Earned Certificates ({earnedCerts.length})
          </h2>
        </div>

        {earnedCerts.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px dashed #CBD5E1',
              padding: '36px',
              textAlign: 'center',
            }}
          >
            <Award size={36} style={{ color: '#94A3B8', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
              No Certificates Earned Yet
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '440px', margin: '0 auto' }}>
              Complete all lessons and topics in any placement course to unlock your official verified certificate!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {earnedCerts.map((cert) => (
              <div
                key={cert.slug || cert.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #A7F3D0',
                  padding: '22px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#ECFDF5',
                        color: '#059669',
                      }}
                    >
                      <CheckCircle size={12} />
                      <span>Verified Official</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                      {cert.credentialId}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                    {cert.title}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '14px' }}>
                    Issued to <strong>{userName}</strong> • {cert.issueDate}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenCertificateModal({
                        trackTitle: cert.title,
                        studentName: userName,
                        date: cert.issueDate,
                        credentialId: cert.credentialId,
                      })
                    }
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#059669',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Award size={14} />
                    <span>View Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="Download / Print"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Locked / In Progress Certificates ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Lock size={16} style={{ color: '#94A3B8' }} />
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: '18px',
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
            }}
          >
            In-Progress Certifications ({lockedCerts.length})
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {lockedCerts.map((cert) => (
            <div
              key={cert.slug || cert.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '18px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
                  {cert.completedTopics}/{cert.totalTopics} Topics Completed
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669' }}>
                  {cert.pct}%
                </span>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                {cert.title}
              </h3>

              <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ width: `${cert.pct}%`, height: '100%', background: '#10B981', borderRadius: '9999px' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
