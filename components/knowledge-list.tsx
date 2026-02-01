
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

type Source = {
    id: string;
    type: string;
    source_url: string | null;
    status: string | null;
    created_at: string;
};

export function KnowledgeList({ sources }: { sources: Source[] }) {
    if (sources.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                No knowledge sources added yet.
            </div>
        );
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Added</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sources.map((source) => (
                        <TableRow key={source.id}>
                            <TableCell className="font-medium truncate max-w-[200px]" title={source.source_url || ""}>
                                {source.source_url}
                            </TableCell>
                            <TableCell className="capitalize">{source.type}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${source.status === "indexed"
                                            ? "bg-green-100 text-green-700"
                                            : source.status === "failed"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {source.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {formatDistanceToNow(new Date(source.created_at), { addSuffix: true })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
