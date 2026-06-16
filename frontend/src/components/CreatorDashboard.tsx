import React, { useState } from 'react';
import {
  MdVideoLibrary, MdBarChart, MdAttachMoney, MdLiveTv,
  MdUpload, MdNotifications, MdSettings, MdLogout,
  MdTrendingUp, MdVisibility, MdPeople, MdStar,
  MdMoreVert, MdEdit, MdDelete, MdPlayCircleOutline,
  MdAdd, MdArrowUpward, MdArrowDownward, MdCalendarToday,
  MdMenu, MdClose,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  revenue: number;
  status: 'published' | 'draft' | 'processing';
  date: string;
}

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Parenting in the Digital Age',
    thumbnail: 'https://picsum.photos/seed/v1/320/180',
    views: 4821,
    revenue: 3200,
    status: 'published',
    date: 'May 3, 2026',
  },
  {
    id: '2',
    title: 'Raising Emotionally Resilient Kids',
    thumbnail: 'https://picsum.photos/seed/v2/320/180',
    views: 3104,
    revenue: 2100,
    status: 'published',
    date: 'Apr 28, 2026',
  },
  {
    id: '3',
    title: 'Teen Mental Health: A Guide for Parents',
    thumbnail: 'https://picsum.photos/seed/v3/320/180',
    views: 1560,
    revenue: 940,
    status: 'published',
    date: 'Apr 15, 2026',
  },
  {
    id: '4',
    title: 'Nutrition & Child Development',
    thumbnail: 'https://picsum.photos/seed/v4/320/180',
    views: 0,
    revenue: 0,
    status: 'processing',
    date: 'May 10, 2026',
  },
  {
    id: '5',
    title: 'Homework Strategies That Actually Work',
    thumbnail: 'https://picsum.photos/seed/v5/320/180',
    views: 0,
    revenue: 0,
    status: 'draft',
    date: 'May 8, 2026',
  },
];

const STATS: StatCard[] = [
  { label: 'Total Views',   value: '9,485',     change: 12.4, icon: <MdVisibility /> },
  { label: 'Total Revenue', value: 'KES 6,240', change: 8.1,  icon: <MdAttachMoney /> },
  { label: 'Subscribers',   value: '1,342',     change: 5.7,  icon: <MdPeople /> },
  { label: 'Avg. Rating',   value: '4.8 / 5',   change: 2.3,  icon: <MdStar /> },
];

const NAV_ITEMS = [
  { label: 'Overview',   icon: <MdBarChart /> },
  { label: 'My Content', icon: <MdVideoLibrary /> },
  { label: 'Analytics',  icon: <MdTrendingUp /> },
  { label: 'Earnings',   icon: <MdAttachMoney /> },
  { label: 'Live Talks', icon: <MdLiveTv /> },
  { label: 'Settings',   icon: <MdSettings /> },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: Video['status'] }> = ({ status }) => {
  const styles: Record<Video['status'], string> = {
    published:  'bg-green-500/15 text-green-400 border-green-500/30',
    draft:      'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${styles[status]}`}>
      {status}
    </span>
  );
};

// ─── Video Table Row ──────────────────────────────────────────────────────────

const VideoRow: React.FC<{ video: Video }> = ({ video }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className="border-b border-border/40 hover:bg-secondary/40 transition-colors group">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-12 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
              <MdPlayCircleOutline className="text-white text-2xl" />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground line-clamp-2 max-w-[180px]">
            {video.title}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted hidden md:table-cell">{video.date}</td>
      <td className="py-3 px-4"><StatusBadge status={video.status} /></td>
      <td className="py-3 px-4 text-sm text-foreground font-medium hidden sm:table-cell">
        {video.views.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-sm text-green-400 font-semibold hidden sm:table-cell">
        {video.revenue > 0 ? `KES ${video.revenue.toLocaleString()}` : '—'}
      </td>
      <td className="py-3 px-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted hover:text-foreground transition-colors"
          >
            <MdMoreVert />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden w-36">
              <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-foreground">
                <MdEdit className="text-muted" /> Edit
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-primary">
                <MdDelete className="text-primary" /> Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// ─── Video Table ──────────────────────────────────────────────────────────────

const VideoTable: React.FC<{ videos: Video[] }> = ({ videos }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border/60">
          {['Video', 'Date', 'Status', 'Views', 'Revenue', ''].map((h) => (
            <th key={h} className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wide">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {videos.map((v) => <VideoRow key={v.id} video={v} />)}
      </tbody>
    </table>
  </div>
);

// ─── Upload Modal ─────────────────────────────────────────────────────────────

const UploadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [dragging, setDragging] = useState(false);
  const [title, setTitle]       = useState('');
  const [description, setDesc]  = useState('');
  const [price, setPrice]       = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Upload New Content</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted hover:text-foreground"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={() => setDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
              dragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-secondary/40'
            }`}
          >
            <MdUpload className="text-4xl text-muted" />
            <p className="text-sm text-center text-muted">
              <span className="text-primary font-semibold">Click to upload</span> or drag & drop
              <br />MP4, MOV, AVI (max 2 GB)
            </p>
          </div>

          <input
            type="text"
            placeholder="Video title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground shrink-0">KES</span>
            <input
              type="number"
              placeholder="Access price (leave blank for free)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]">
            Upload & Publish
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Creator Dashboard ────────────────────────────────────────────────────────

const CreatorDashboard: React.FC = () => {
  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();
  const [activeNav, setActiveNav] = useState('Overview');
  const [showUpload, setShowUpload]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const firstName    = user?.name?.split(' ')[0] ?? 'Creator';

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-card border-r border-border flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>

        <div className="px-6 py-5 border-b border-border">
          <a href="/" className="text-primary text-xl font-black tracking-tighter">
            ARBAN<span className="text-foreground">TV</span>
          </a>
          <p className="text-xs text-muted mt-0.5">Creator Studio</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                activeNav === item.label
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-muted hover:text-foreground hover:bg-secondary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 overflow-hidden flex-shrink-0">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix" alt="avatar" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name ?? 'Creator'}</p>
              <p className="text-xs text-muted truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-primary hover:bg-primary/5 transition-all"
          >
            <MdLogout /> Log Out
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
              aria-label="Open sidebar"
            >
              <MdMenu className="text-xl" />
            </button>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">{activeNav}</h1>
              <p className="text-xs text-muted hidden sm:block">Welcome back, {firstName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              <MdAdd className="text-lg" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button className="relative p-2 rounded-full hover:bg-secondary transition-colors text-foreground" aria-label="Notifications">
              <MdNotifications className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">

          {/* OVERVIEW */}
          {activeNav === 'Overview' && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-muted text-sm font-medium">{stat.label}</span>
                      <span className="text-2xl text-primary">{stat.icon}</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change >= 0 ? <MdArrowUpward /> : <MdArrowDownward />}
                      {Math.abs(stat.change)}% this month
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="font-bold text-foreground">Recent Content</h2>
                  <button onClick={() => setActiveNav('My Content')} className="text-sm text-primary font-semibold hover:underline">
                    View All
                  </button>
                </div>
                <VideoTable videos={MOCK_VIDEOS.slice(0, 3)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Schedule a Live Talk', icon: <MdCalendarToday />, action: () => setActiveNav('Live Talks') },
                  { label: 'Upload New Video',     icon: <MdUpload />,        action: () => setShowUpload(true) },
                  { label: 'View Earnings',         icon: <MdAttachMoney />,  action: () => setActiveNav('Earnings') },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={a.action}
                    className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 flex items-center gap-4 text-left transition-all hover:bg-secondary/30 group"
                  >
                    <span className="text-2xl text-primary group-hover:scale-110 transition-transform">{a.icon}</span>
                    <span className="text-sm font-semibold text-foreground">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MY CONTENT */}
          {activeNav === 'My Content' && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold text-foreground">All Videos ({MOCK_VIDEOS.length})</h2>
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition-all"
                >
                  <MdAdd /> Upload
                </button>
              </div>
              <VideoTable videos={MOCK_VIDEOS} />
            </div>
          )}

          {/* EARNINGS */}
          {activeNav === 'Earnings' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Earned',   value: 'KES 6,240', sub: 'All time' },
                  { label: 'This Month',     value: 'KES 1,820', sub: '+8.1% vs last month' },
                  { label: 'Pending Payout', value: 'KES 940',   sub: 'Pays out May 31' },
                ].map((e) => (
                  <div key={e.label} className="bg-card border border-border rounded-2xl p-6">
                    <p className="text-sm text-muted font-medium mb-2">{e.label}</p>
                    <p className="text-3xl font-black text-foreground">{e.value}</p>
                    <p className="text-xs text-muted mt-1">{e.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-5">Revenue by Video</h3>
                <div className="flex flex-col gap-4">
                  {MOCK_VIDEOS.filter((v) => v.revenue > 0).map((v) => (
                    <div key={v.id} className="flex items-center gap-4">
                      <p className="text-sm text-foreground flex-1 truncate">{v.title}</p>
                      <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-700"
                          style={{ width: `${(v.revenue / 3200) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm font-semibold text-green-400 w-28 text-right">
                        KES {v.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIVE TALKS */}
          {activeNav === 'Live Talks' && (
            <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MdLiveTv className="text-4xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Schedule a Live Talk</h3>
              <p className="text-sm text-muted max-w-md">
                Go live with your audience, host Q&A sessions, and run exclusive workshops directly on ArbanTV.
              </p>
              <button className="bg-primary hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30">
                Schedule Live Talk
              </button>
            </div>
          )}

          {/* ANALYTICS */}
          {activeNav === 'Analytics' && (
            <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MdTrendingUp className="text-4xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Analytics Coming Soon</h3>
              <p className="text-sm text-muted max-w-sm">
                Detailed charts and audience insights will appear here once your content gains traction.
              </p>
            </div>
          )}

          {/* SETTINGS */}
          {activeNav === 'Settings' && (
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 max-w-lg">
              <h3 className="font-bold text-foreground text-lg">Profile Settings</h3>
              {[
                { label: 'Display Name', placeholder: user?.name  ?? 'Your name',      type: 'text' },
                { label: 'Email',        placeholder: user?.email ?? 'your@email.com', type: 'email' },
                { label: 'Bio',          placeholder: 'Tell your audience about yourself...', type: 'text' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              ))}
              <button className="self-start bg-primary hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-primary/20">
                Save Changes
              </button>
            </div>
          )}

        </main>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
};

export default CreatorDashboard;