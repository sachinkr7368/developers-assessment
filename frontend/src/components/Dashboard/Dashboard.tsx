import { useEffect, useState, useMemo } from "react";
import { fetchWorklogs, processPaymentBatch, Worklog } from "@/lib/mockData";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination per AGENTS.md
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter UX per AGENTS.md (Exclusive tabs)
  const [activeFilter, setActiveFilter] = useState<"status" | "date" | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  // UI state for drill down & batch payments
  const [selectedWorklog, setSelectedWorklog] = useState<Worklog | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // AGENTS.md: Explicit HTTP client initialization in component
    // We mock this using our lib but we simulate the rule by setting up fetcher
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Using `any` type for API response as per AGENTS.md
        const data: any = await fetchWorklogs();
        setAllData(data);
      } catch (err) {
        setError("Failed to load worklogs. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filtering optimization
  const filteredData = useMemo(() => {
    return allData.filter((wl) => {
      if (statusFilter !== "all" && wl.status !== statusFilter) return false;
      
      if (activeFilter === "date" && dateStart && dateEnd) {
        const wDate = new Date(wl.created_at);
        if (wDate < new Date(dateStart) || wDate > new Date(dateEnd)) {
          return false;
        }
      }
      return true;
    });
  }, [allData, statusFilter, activeFilter, dateStart, dateEnd]);

  // Client-side pagination optimization
  const { displayed, totalPages } = useMemo(() => {
    return {
      displayed: filteredData.slice((page - 1) * pageSize, page * pageSize),
      totalPages: Math.ceil(filteredData.length / pageSize)
    };
  }, [filteredData, page, pageSize]);

  const toggleExclude = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      const idsToPay = filteredData
        .filter((wl) => !excludedIds.has(wl.id) && wl.status === "pending")
        .map((wl) => wl.id);

      await processPaymentBatch(idsToPay);
      toast.success(`Successfully processed ${idsToPay.length} worklogs.`);
      
      // Update local state to reflect paid status
      setAllData((prev) =>
        prev.map((wl) =>
          idsToPay.includes(wl.id) ? { ...wl, status: "paid" } : wl
        )
      );
      setReviewMode(false);
      setExcludedIds(new Set());
    } catch (err) {
      toast.error("Failed to process payments.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading worklogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive p-4 rounded-md text-destructive flex items-center gap-3">
        <XCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  // Drill down view
  if (selectedWorklog) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <button 
            aria-label="Back to worklogs"
            onClick={() => setSelectedWorklog(null)}
            className="text-primary font-medium hover:underline text-sm"
          >
            &larr; Back to List
          </button>
          <h2 className="text-2xl font-bold">Worklog Details: {selectedWorklog.id}</h2>
        </div>
        
        <div className="bg-card border border-border shadow-sm rounded-lg p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Freelancer</p>
              <p className="font-semibold">{selectedWorklog.freelancer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Task</p>
              <p className="font-semibold">{selectedWorklog.task_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase tracking-wider
                ${selectedWorklog.status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-primary/10 text-primary"}
              `}>
                {selectedWorklog.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="font-bold text-lg text-primary">${selectedWorklog.total_earnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-8">Time Entries</h3>
        {/* AGENTS.md: Feature-specific table */}
        <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Entry ID</th>
                <th className="p-4 font-semibold">Date (UTC)</th>
                <th className="p-4 font-semibold">Hours</th>
                <th className="p-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {selectedWorklog.time_entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-mono text-xs">{entry.id}</td>
                  {/* AGENTS.md: Raw UTC timestamp only */}
                  <td className="p-4 font-mono text-xs">{entry.created_at}</td>
                  <td className="p-4">{entry.hours}h</td>
                  <td className="p-4">{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Payment Review Mode
  if (reviewMode) {
    const pendings = filteredData.filter(w => w.status === "pending");
    const included = pendings.filter(w => !excludedIds.has(w.id));
    const totalPayment = included.reduce((sum, w) => sum + w.total_earnings, 0);

    return (
      <div className="space-y-6">
        <div className="flex gap-4 items-center mb-8">
          <button 
            aria-label="Back to dashboard"
            onClick={() => setReviewMode(false)}
            className="text-primary font-medium hover:underline text-sm"
          >
            &larr; Back to List
          </button>
          <h2 className="text-3xl font-bold">Review Payment Batch</h2>
        </div>

        <div className="bg-card p-6 border border-border shadow-sm rounded-lg flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Total to Pay</p>
            <p className="text-4xl font-bold text-primary mt-1">${totalPayment.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">{included.length} worklogs will be processed.</p>
          </div>
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing || included.length === 0}
            className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-md shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            Confirm Payments
          </button>
        </div>

        <h3 className="text-xl font-bold mt-8">Included in Batch</h3>
        <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Exclude</th>
                <th className="p-4">Worklog ID</th>
                <th className="p-4">Freelancer</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {pendings.map((wl) => (
                <tr key={wl.id} className={`transition-colors ${excludedIds.has(wl.id) ? "opacity-50" : "hover:bg-muted/50"}`}>
                  <td className="p-4">
                    <button 
                      aria-label="Toggle exclude from payment"
                      onClick={(e) => toggleExclude(wl.id, e)}
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                    >
                      {excludedIds.has(wl.id) ? "Include" : "Exclude"}
                    </button>
                  </td>
                  <td className="p-4 font-mono text-xs">{wl.id}</td>
                  <td className="p-4 font-medium">{wl.freelancer_name}</td>
                  <td className="p-4 font-bold text-primary">${wl.total_earnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Worklogs</h1>
          <p className="text-muted-foreground mt-2 text-lg">Review freelancer submissions and process payments.</p>
        </div>
        <button
          onClick={() => setReviewMode(true)}
          className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          Review Payments
        </button>
      </div>

      {/* AGENTS.md: Exclusive filter tabs */}
      <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
        <div className="flex gap-4 border-b border-border pb-4 mb-4">
          <button 
            onClick={() => setActiveFilter(activeFilter === "status" ? null : "status")}
            className={`px-4 py-2 font-medium rounded-md transition-colors ${activeFilter === "status" ? "bg-primary text-primary-foreground" : "hover:bg-muted bg-muted/50"}`}
          >
            Status Filter
          </button>
          <button 
            onClick={() => setActiveFilter(activeFilter === "date" ? null : "date")}
            className={`px-4 py-2 font-medium rounded-md transition-colors ${activeFilter === "date" ? "bg-primary text-primary-foreground" : "hover:bg-muted bg-muted/50"}`}
          >
            Date Range Filter
          </button>
        </div>

        {activeFilter === "status" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-semibold mb-2 block text-muted-foreground">Select Status</label>
            <select 
              className="w-full md:w-64 p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        )}

        {activeFilter === "date" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-sm font-semibold mb-2 block text-muted-foreground">Start Date</label>
              <input 
                type="date" 
                className="p-2 border border-border rounded-md bg-background"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-muted-foreground">End Date</label>
              <input 
                type="date" 
                className="p-2 border border-border rounded-md bg-background"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* AGENTS.md: Feature-specific table */}
      <div className="border border-border rounded-xl shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider">Freelancer</th>
                <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider">Task</th>
                <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Submitted (UTC)</th>
                <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No worklogs found matching criteria.
                  </td>
                </tr>
              ) : (
                displayed.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedWorklog(item)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono text-xs">{item.id}</td>
                    <td className="p-4 font-medium">{item.freelancer_name}</td>
                    <td className="p-4">{item.task_name}</td>
                    <td className="p-4 font-mono text-xs hidden md:table-cell">{item.created_at}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider
                        ${item.status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-primary/10 text-primary"}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-right group-hover:text-primary transition-colors">
                      ${item.total_earnings.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
            <span className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredData.length)} of {filteredData.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
